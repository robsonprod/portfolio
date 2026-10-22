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
