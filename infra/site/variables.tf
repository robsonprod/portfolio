variable "project" {
  type    = string
  default = "portfolio"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "price_class" {
  description = "PriceClass_All inclui edges na América do Sul (São Paulo/Fortaleza). As classes 100/200 não incluem."
  type        = string
  default     = "PriceClass_All"
}
