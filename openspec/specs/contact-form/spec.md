# contact-form Specification

## Purpose
Let recruiters send a message to the engineer from the Contact page, while resisting spam and abuse.

## Requirements

### Requirement: Message submission
The Contact page SHALL provide a form with name, email and message fields. On submit, a valid form SHALL be sent as a JSON POST to `/api/contact` on the same origin as the site.

#### Scenario: Valid submission
- **WHEN** the visitor submits a name, a valid email and a message of 10 to 2000 characters
- **THEN** the form is sent to `/api/contact`
- **AND** a success confirmation replaces the form after the API accepts it

### Requirement: Client-side validation
The form SHALL validate input before sending: name is required (max 100 characters), email must be valid (max 254 characters), and message must have 10 to 2000 characters. Invalid forms MUST NOT be sent. Client-side validation is for usability only; the API MUST validate again.

#### Scenario: Invalid submission
- **WHEN** the visitor submits an empty name or an invalid email
- **THEN** no request is sent
- **AND** an error message is shown next to each invalid field

### Requirement: Honeypot field
The form SHALL include a field hidden from humans and from keyboard navigation. Its value SHALL be sent with the request so the API can discard submissions where it is filled.

#### Scenario: Human submission
- **WHEN** a human submits the form
- **THEN** the hidden field is sent empty

### Requirement: Error feedback
The form SHALL show a specific message when the API rejects the request for rate limiting (HTTP 429), and a generic retry message for any other failure. The visitor's input SHALL be preserved on failure.

#### Scenario: Rate limited
- **WHEN** the API responds with HTTP 429
- **THEN** the form shows a message asking the visitor to wait a few minutes

#### Scenario: Server error
- **WHEN** the API responds with any other error
- **THEN** the form shows a generic "try again" message and keeps the typed values

### Requirement: Direct contact channels
The Contact page SHALL list direct channels: email, LinkedIn and, when configured, GitHub. External links SHALL open in a new tab without giving the opened page access to the site.

#### Scenario: Opening LinkedIn
- **WHEN** the visitor selects the LinkedIn channel
- **THEN** LinkedIn opens in a new tab with `noopener` and `noreferrer`
