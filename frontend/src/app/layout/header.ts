import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18n } from '../core/i18n.service';
import { Theme } from '../core/theme.service';
import { PROFILE } from '../content/profile';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './header.scss',
  template: `
    <header class="header" [class.open]="menuOpen()">
      <div class="container header__inner">
        <a routerLink="/" class="brand" (click)="close()">
          <span class="brand__mark">{{ initials }}</span>
          <span class="brand__name">{{ name }}</span>
        </a>

        <nav class="nav" [attr.aria-label]="t().nav.home">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="close()">{{ t().nav.home }}</a>
          <a routerLink="/experience" routerLinkActive="active" (click)="close()">{{ t().nav.experience }}</a>
          <a routerLink="/projects" routerLinkActive="active" (click)="close()">{{ t().nav.projects }}</a>
          <a routerLink="/contact" class="btn btn--primary btn--sm nav__hire" (click)="close()">{{ t().nav.hire }}</a>
        </nav>

        <div class="actions">
          <button type="button" class="icon-btn lang" (click)="i18n.toggle()" [attr.aria-label]="t().a11y.toggleLang" [title]="t().a11y.toggleLang">
            <app-icon name="globe" />
            <span>{{ i18n.lang() === 'en' ? 'PT' : 'EN' }}</span>
          </button>
          <button type="button" class="icon-btn" (click)="theme.toggle($event)" [attr.aria-label]="t().a11y.toggleTheme" [title]="t().a11y.toggleTheme">
            <app-icon name="moon" class="show-light" />
            <app-icon name="sun" class="show-dark" />
          </button>
          <button
            type="button"
            class="icon-btn menu-btn"
            (click)="menuOpen.set(!menuOpen())"
            [attr.aria-expanded]="menuOpen()"
            [attr.aria-label]="menuOpen() ? t().a11y.closeMenu : t().a11y.openMenu"
          >
            <app-icon [name]="menuOpen() ? 'x' : 'menu'" />
          </button>
        </div>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly i18n = inject(I18n);
  protected readonly theme = inject(Theme);
  protected readonly t = this.i18n.t;
  protected readonly name = PROFILE.name;
  protected readonly initials = PROFILE.initials;
  protected readonly menuOpen = signal(false);

  protected close(): void {
    this.menuOpen.set(false);
  }
}
