variable "project" {
  description = "Prefixo dos recursos."
  type        = string
  default     = "portfolio"
}

variable "region" {
  description = "us-east-1: exigida pelo CloudFront para certificados ACM e tem SES/WAF completos."
  type        = string
  default     = "us-east-1"
}

variable "github_repo" {
  description = "Repositório no formato <owner>/<repo>, ex.: robsonazevedo/portfolio."
  type        = string

  validation {
    condition     = can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.github_repo))
    error_message = "Use o formato <owner>/<repo>."
  }
}

# Subject imutável do OIDC do GitHub: o token traz IDs numéricos além dos nomes
# (repo:<owner>@<owner_id>/<repo>@<repo_id>:...). Protege contra "repojacking":
# um repositório recriado com o mesmo nome por outra pessoa tem outro ID e não casa com a trust policy.
# Descubra os IDs com:
#   curl -s https://api.github.com/repos/<owner>/<repo>/actions/oidc/customization/sub
# Deixe null para usar o formato antigo (só nomes).
variable "github_owner_id" {
  description = "ID numérico do dono do repositório no GitHub (usuário ou organização)."
  type        = number
  default     = null
}

variable "github_repo_id" {
  description = "ID numérico do repositório no GitHub."
  type        = number
  default     = null
}
