terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # Configuração parcial: o bucket vem de fora (-backend-config), porque o nome
  # tem o account id e backend não aceita variáveis.
  #   terraform init -backend-config="bucket=portfolio-tfstate-<account_id>"
  backend "s3" {
    key          = "site/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true # lock nativo no S3 (Terraform >= 1.10), sem precisar de DynamoDB
  }
}

provider "aws" {
  region = var.region
  default_tags {
    tags = { Project = var.project, ManagedBy = "terraform", Stack = "site" }
  }
}
