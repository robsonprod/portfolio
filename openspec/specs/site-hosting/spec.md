# site-hosting Specification

## Purpose
Serve the static site globally over HTTPS from a private origin, with security headers and caching that keep visitors safe and always on the latest version.

## Requirements

### Requirement: HTTPS only
The site SHALL be served only over HTTPS. Plain HTTP requests SHALL be redirected to HTTPS, and responses SHALL include HSTS with a max-age of at least one year.

#### Scenario: HTTP request
- **WHEN** a visitor requests the site over HTTP
- **THEN** the response redirects to the same URL over HTTPS

### Requirement: Private origin
The storage holding the site files MUST NOT be publicly accessible. Only the site's own CDN distribution SHALL be able to read it, and any non-TLS access to it SHALL be denied.

#### Scenario: Direct access to the origin
- **WHEN** a client requests a file directly from the storage endpoint
- **THEN** access is denied

### Requirement: Security headers
Every response SHALL include: a Content-Security-Policy that only allows scripts from the site's own origin and forbids framing; `X-Content-Type-Options: nosniff`; `X-Frame-Options: DENY`; a strict referrer policy; and a Permissions-Policy that disables camera, microphone, geolocation and payment.

#### Scenario: Injected inline script
- **WHEN** a page contains an inline `<script>` that was not part of the build
- **THEN** the browser refuses to execute it

#### Scenario: Embedding in an iframe
- **WHEN** another site tries to load the portfolio in an iframe
- **THEN** the browser blocks it

### Requirement: Clean page URLs
Page paths without a file extension, with or without a trailing slash, SHALL serve that page's pre-rendered HTML. Missing files SHALL return status 404 with the Home page content.

#### Scenario: Path without extension
- **WHEN** a visitor requests `/projects` or `/projects/`
- **THEN** the pre-rendered Projects page is returned

#### Scenario: Missing file
- **WHEN** a visitor requests a path that does not exist
- **THEN** the response status is 404

### Requirement: Caching
Files whose names contain a content hash SHALL be cacheable for one year as immutable. HTML documents SHALL be revalidated on every visit so that a new deployment is visible immediately.

#### Scenario: New deployment
- **WHEN** a new version is deployed
- **THEN** returning visitors receive the new HTML on their next visit
- **AND** the new HTML references only files that exist
