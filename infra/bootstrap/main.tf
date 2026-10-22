# Bootstrap: roda UMA vez, localmente, com suas credenciais de admin.
# Cria o que o pipeline precisa para existir:
#   1. Bucket do Terraform state (usado por infra/site)
#   2. Provedor OIDC do GitHub (Actions troca um token JWT por credenciais temporárias — sem access key guardada)
#   3. Duas roles: "plan" (só leitura, PRs) e "deploy" (escrita, só branch main via environment production)

terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = var.project, ManagedBy = "terraform", Stack = "bootstrap" }
  }
}

data "aws_caller_identity" "current" {}

locals {
  account_id   = data.aws_caller_identity.current.account_id
  state_bucket = "${var.project}-tfstate-${local.account_id}"
  # Prefixo dos recursos que o pipeline pode gerenciar (ex.: portfolio-site-123456789012)
  managed_prefix = "${var.project}-"

  # Início do claim "sub" do token OIDC: formato imutável (com IDs) quando os IDs são informados.
  repo_owner = split("/", var.github_repo)[0]
  repo_name  = split("/", var.github_repo)[1]
  use_ids    = var.github_owner_id != null && var.github_repo_id != null
  sub_prefix = local.use_ids ? "repo:${local.repo_owner}@${var.github_owner_id}/${local.repo_name}@${var.github_repo_id}" : "repo:${var.github_repo}"
}

# ---------------------------------------------------------------------------
# 1. Bucket do Terraform state
# ---------------------------------------------------------------------------
resource "aws_s3_bucket" "state" {
  bucket = local.state_bucket
  lifecycle { prevent_destroy = true }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration { status = "Enabled" } # permite voltar um state corrompido
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket                  = aws_s3_bucket.state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "state_tls_only" {
  statement {
    sid       = "DenyInsecureTransport"
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id
  policy = data.aws_iam_policy_document.state_tls_only.json
}

# ---------------------------------------------------------------------------
# 2. OIDC do GitHub Actions
# ---------------------------------------------------------------------------
resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

# Quem pode assumir cada role. O "sub" do token identifica repo + contexto:
#   PR:     repo:<owner>[@id]/<repo>[@id]:pull_request
#   Deploy: repo:<owner>[@id]/<repo>[@id]:environment:production
data "aws_iam_policy_document" "trust_plan" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["${local.sub_prefix}:pull_request"]
    }
  }
}

data "aws_iam_policy_document" "trust_deploy" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["${local.sub_prefix}:environment:production"]
    }
  }
}

# ---------------------------------------------------------------------------
# 3a. Role de PLAN (somente leitura) — usada em pull requests
# ---------------------------------------------------------------------------
data "aws_iam_policy_document" "plan" {
  statement {
    sid       = "ReadState"
    actions   = ["s3:ListBucket", "s3:GetObject"]
    resources = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"]
  }
  statement {
    sid       = "ReadSiteBuckets"
    actions   = ["s3:Get*", "s3:List*"]
    resources = ["arn:aws:s3:::${local.managed_prefix}site-*", "arn:aws:s3:::${local.managed_prefix}site-*/*"]
  }
  statement {
    sid       = "ReadCloudFront"
    actions   = ["cloudfront:Get*", "cloudfront:List*", "cloudfront:Describe*"]
    resources = ["*"]
  }
}

resource "aws_iam_role" "plan" {
  name                 = "${var.project}-gha-plan"
  assume_role_policy   = data.aws_iam_policy_document.trust_plan.json
  max_session_duration = 3600
}

resource "aws_iam_role_policy" "plan" {
  role   = aws_iam_role.plan.id
  policy = data.aws_iam_policy_document.plan.json
}

# ---------------------------------------------------------------------------
# 3b. Role de DEPLOY (escrita) — só a branch main, via environment "production"
# Nas próximas partes (Lambda, API Gateway, WAF...) essa policy cresce.
# ---------------------------------------------------------------------------
data "aws_iam_policy_document" "deploy" {
  statement {
    sid       = "StateBucketList"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.state.arn]
  }
  statement {
    sid       = "StateReadWrite"
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"] # DeleteObject: liberar o lockfile
    resources = ["${aws_s3_bucket.state.arn}/*"]
  }
  statement {
    sid       = "ManageSiteBuckets"
    actions   = ["s3:*"]
    resources = ["arn:aws:s3:::${local.managed_prefix}site-*", "arn:aws:s3:::${local.managed_prefix}site-*/*"]
  }
  statement {
    # CloudFront tem suporte limitado a permissões por recurso; num account pessoal isso é aceitável.
    sid       = "ManageCloudFront"
    actions   = ["cloudfront:*"]
    resources = ["*"]
  }
}

resource "aws_iam_role" "deploy" {
  name                 = "${var.project}-gha-deploy"
  assume_role_policy   = data.aws_iam_policy_document.trust_deploy.json
  max_session_duration = 3600
}

resource "aws_iam_role_policy" "deploy" {
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}
