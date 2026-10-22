# delivery-pipeline Specification

## Purpose
Verify every change before it is merged and deploy the main branch to production automatically, without long-lived cloud credentials.

## Requirements

### Requirement: Pull request checks
Every pull request to `main` SHALL run the front-end tests and production build, check Terraform formatting, validate the configuration and publish an infrastructure plan in the run summary.

#### Scenario: Failing test
- **WHEN** a pull request breaks a unit test
- **THEN** the check fails and the pull request is marked as failing

#### Scenario: Infrastructure change
- **WHEN** a pull request changes the infrastructure code
- **THEN** the planned infrastructure changes appear in the run summary

### Requirement: Least-privilege cloud access
The pipeline MUST authenticate to AWS through short-lived OIDC credentials only. Pull request runs MUST receive read-only access; write access MUST be limited to runs of the `main` branch in the `production` environment. Pull requests from forks MUST NOT receive cloud credentials.

#### Scenario: Pull request run
- **WHEN** a pull request workflow tries to modify infrastructure
- **THEN** AWS denies the action

#### Scenario: Fork pull request
- **WHEN** a pull request comes from a fork
- **THEN** the infrastructure plan step is skipped

### Requirement: Automatic deployment
Every push to `main` that touches the front-end or the site infrastructure SHALL test and build the site once, apply the infrastructure, publish that same build and refresh the CDN cache. Deployments SHALL never run concurrently and SHALL never be cancelled midway.

#### Scenario: Merge to main
- **WHEN** a change is merged into `main`
- **THEN** the site URL serves the new version after the workflow finishes

#### Scenario: Two quick merges
- **WHEN** a second merge happens while a deployment is running
- **THEN** the second deployment waits for the first one to finish

### Requirement: Safe publish order
During a deployment, new hashed assets SHALL be uploaded before the HTML that references them, and files removed from the build SHALL be deleted only after the new HTML is published.

#### Scenario: Visitor during deployment
- **WHEN** a visitor loads a page while a deployment is in progress
- **THEN** every file referenced by the HTML they receive exists
