# Copie estes valores para as "Variables" do repositório no GitHub (Settings → Secrets and variables → Actions).
output "github_variables" {
  value = {
    AWS_REGION          = var.region
    TF_STATE_BUCKET     = aws_s3_bucket.state.bucket
    AWS_PLAN_ROLE_ARN   = aws_iam_role.plan.arn
    AWS_DEPLOY_ROLE_ARN = aws_iam_role.deploy.arn
  }
}
