import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName } from '../content/types';

// Ícones SVG inline (traço no estilo Lucide). Sem fonte de ícones nem request extra.
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('server') { <svg:rect width="20" height="8" x="2" y="2" rx="2" /><svg:rect width="20" height="8" x="2" y="14" rx="2" /><svg:path d="M6 6h.01M6 18h.01" /> }
        @case ('cloud') { <svg:path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /> }
        @case ('monitor') { <svg:rect width="20" height="14" x="2" y="3" rx="2" /><svg:path d="M8 21h8M12 17v4" /> }
        @case ('sparkles') { <svg:path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2Z" /><svg:path d="M19 3v4M17 5h4M5 17v3M3.5 18.5h3" /> }
        @case ('briefcase') { <svg:rect width="20" height="14" x="2" y="7" rx="2" /><svg:path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /> }
        @case ('graduation') { <svg:path d="M22 10 12 5 2 10l10 5 10-5Z" /><svg:path d="M6 12v5c3 3 9 3 12 0v-5" /> }
        @case ('globe') { <svg:circle cx="12" cy="12" r="10" /><svg:path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /> }
        @case ('mail') { <svg:rect width="20" height="16" x="2" y="4" rx="2" /><svg:path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /> }
        @case ('linkedin') { <svg:path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><svg:rect width="4" height="12" x="2" y="9" /><svg:circle cx="4" cy="4" r="2" /> }
        @case ('github') { <svg:path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><svg:path d="M9 18c-4.51 2-5-2-7-2" /> }
        @case ('map-pin') { <svg:path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><svg:circle cx="12" cy="10" r="3" /> }
        @case ('arrow-right') { <svg:path d="M5 12h14m-6-6 6 6-6 6" /> }
        @case ('external') { <svg:path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /> }
        @case ('moon') { <svg:path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /> }
        @case ('sun') { <svg:circle cx="12" cy="12" r="4" /><svg:path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /> }
        @case ('menu') { <svg:path d="M4 6h16M4 12h16M4 18h16" /> }
        @case ('x') { <svg:path d="M18 6 6 18M6 6l12 12" /> }
        @case ('send') { <svg:path d="m22 2-7 20-4-9-9-4Z" /><svg:path d="M22 2 11 13" /> }
        @case ('check') { <svg:path d="M20 6 9 17l-5-5" /> }
        @case ('bot') { <svg:path d="M12 8V4H8" /><svg:rect width="16" height="12" x="4" y="8" rx="2" /><svg:path d="M2 14h2M20 14h2M15 13v2M9 13v2" /> }
        @case ('code') { <svg:path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /> }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
