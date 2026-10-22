# site-content Specification

## Purpose
Present the engineer's profile, focus areas, experience and study projects to recruiters as a fast, accessible, bilingual website with a light and a dark theme.

## Requirements

### Requirement: Page structure
The site SHALL provide four pages — Home, Experience, Projects and Contact — reachable from a persistent header on every page. Unknown paths SHALL redirect to Home.

#### Scenario: Navigating between pages
- **WHEN** a visitor selects "Experience" in the header
- **THEN** the Experience page is shown without a full page reload
- **AND** the header stays in place while the page content changes

#### Scenario: Unknown path
- **WHEN** a visitor opens a path that does not match any page
- **THEN** the Home page is shown

### Requirement: Pre-rendered content
Every page SHALL be delivered as pre-rendered HTML that contains the page's English content, so that link previews and crawlers see the content without executing JavaScript.

#### Scenario: Crawler fetches a page
- **WHEN** a client without JavaScript requests `/experience`
- **THEN** the HTML response contains the experience entries in English

### Requirement: Home landing page
The Home page SHALL present, in order: the engineer's name, role, headline and photo; key highlights; focus areas with AI engineering first; the AI-assisted working process; the technology stack; and a call to action leading to the Contact page.

#### Scenario: Hire call to action
- **WHEN** a visitor selects "Hire me" on the Home page
- **THEN** the Contact page is shown

#### Scenario: Missing photo
- **WHEN** the profile photo cannot be loaded
- **THEN** the engineer's initials are shown in its place

### Requirement: Bilingual content
All user-facing text SHALL be available in English and Portuguese. English SHALL be the default. A visitor SHALL be able to switch language with one action, and the choice SHALL persist across visits on the same browser.

#### Scenario: First visit
- **WHEN** a visitor opens the site for the first time
- **THEN** the content is shown in English, regardless of the browser language

#### Scenario: Switching to Portuguese
- **WHEN** the visitor activates the language toggle
- **THEN** all visible text, the document title and the page language attribute change to Portuguese without reloading

#### Scenario: Returning visitor
- **WHEN** a visitor who chose Portuguese returns to the site
- **THEN** the content is shown in Portuguese after the page loads

### Requirement: Light and dark theme
The site SHALL offer a light and a dark theme. The initial theme SHALL follow the visitor's saved choice or, if none, the operating system preference. The correct theme SHALL be applied before the first paint, with no flash of the other theme.

#### Scenario: Toggling the theme
- **WHEN** the visitor activates the theme toggle
- **THEN** the theme switches and the choice is saved for future visits

#### Scenario: System preference
- **WHEN** a first-time visitor's operating system is set to dark mode
- **THEN** the site renders in the dark theme on first paint

### Requirement: Motion and accessibility
Animations SHALL be disabled for visitors whose system requests reduced motion. Content SHALL remain fully visible when JavaScript is unavailable. Icon-only controls SHALL have accessible names, and a skip-to-content link SHALL be available to keyboard users.

#### Scenario: Reduced motion
- **WHEN** the visitor's system has reduced motion enabled
- **THEN** page transitions, scroll reveals and decorative animations are not played

#### Scenario: JavaScript disabled
- **WHEN** JavaScript fails to load
- **THEN** all page content is visible and readable

### Requirement: Content privacy
The site MUST NOT display confidential employer or client data such as customer counts or internal metrics. The contact email address MUST NOT appear in the pre-rendered HTML.

#### Scenario: Scraping the contact page
- **WHEN** a bot reads the pre-rendered HTML of `/contact`
- **THEN** the email address is not present in the response
