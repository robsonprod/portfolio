import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../../core/i18n.service';
import { PROFILE } from '../../content/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { Spotlight } from '../../shared/spotlight.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Icon, Reveal, Spotlight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.scss',
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero__bg" aria-hidden="true">
        <span class="blob blob--1"></span>
        <span class="blob blob--2"></span>
        <span class="blob blob--3"></span>
        <span class="grid-bg"></span>
      </div>

      <div class="container hero__inner">
        <div class="hero__text">
          <p class="badge" appReveal><span class="badge__dot"></span>{{ t().home.badge }}</p>
          <p class="hero__hello" appReveal [revealDelay]="60">{{ t().home.hello }}</p>
          <h1 class="hero__name" appReveal [revealDelay]="120">{{ p.name }}</h1>
          <p class="hero__role gradient-text" appReveal [revealDelay]="180">{{ t().home.role }}</p>
          <p class="hero__headline" appReveal [revealDelay]="240">{{ t().home.headline }}</p>
          <p class="hero__intro muted" appReveal [revealDelay]="300">{{ t().home.intro }}</p>

          <div class="hero__cta" appReveal [revealDelay]="360">
            <a routerLink="/contact" class="btn btn--primary btn--lg">
              {{ t().home.ctaHire }} <app-icon name="arrow-right" />
            </a>
            <a routerLink="/experience" class="btn btn--ghost btn--lg">{{ t().home.ctaExperience }}</a>
          </div>

          <div class="hero__social" appReveal [revealDelay]="420">
            <a [href]="p.links.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="icon-btn"><app-icon name="linkedin" /></a>
            @if (p.links.github) {
              <a [href]="p.links.github" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="icon-btn"><app-icon name="github" /></a>
            }
            <a routerLink="/contact" aria-label="Email" class="icon-btn"><app-icon name="mail" /></a>
          </div>
        </div>

        <div class="hero__visual" appReveal [revealDelay]="200">
          <div class="avatar">
            <div class="avatar__ring"></div>
            <div class="avatar__img">
              @if (photoOk()) {
                <img [src]="p.photo" [alt]="t().a11y.photo" width="320" height="320" fetchpriority="high" (error)="photoOk.set(false)" />
              } @else {
                <span>{{ p.initials }}</span>
              }
            </div>
            <span class="chip-float chip-float--1">🤖 AI Agents</span>
            <span class="chip-float chip-float--2">🧠 LLMs</span>
            <span class="chip-float chip-float--3">☕ Java</span>
            <span class="chip-float chip-float--4">☁️ AWS</span>
          </div>
        </div>
      </div>

      <div class="container">
        <ul class="highlights">
          @for (h of t().home.highlights; track $index) {
            <li appReveal [revealDelay]="$index * 100">
              <strong class="gradient-text">{{ h.value }}</strong>
              <span class="muted">{{ h.label }}</span>
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- ÁREAS DE FOCO -->
    <section class="section">
      <div class="container">
        <header class="section-head" appReveal>
          <p class="eyebrow">{{ t().home.focusEyebrow }}</p>
          <h2>{{ t().home.focusTitle }}</h2>
          <p class="muted">{{ t().home.focusSubtitle }}</p>
        </header>

        <div class="focus-grid">
          @for (f of t().home.focus; track f.icon) {
            <article class="card focus" appReveal appSpotlight [revealDelay]="$index * 90">
              <span class="focus__icon"><app-icon [name]="f.icon" /></span>
              <h3>{{ f.title }}</h3>
              <p class="muted">{{ f.description }}</p>
              <ul class="tags">
                @for (tag of f.tags; track tag) {
                  <li>{{ tag }}</li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- COMO EU TRABALHO COM IA -->
    <section class="section section--alt">
      <div class="container">
        <header class="section-head" appReveal>
          <p class="eyebrow">{{ t().home.process.eyebrow }}</p>
          <h2>{{ t().home.process.title }}</h2>
          <p class="muted">{{ t().home.process.subtitle }}</p>
        </header>

        <ol class="process">
          @for (s of t().home.process.steps; track $index) {
            <li class="process__step" appReveal [revealDelay]="$index * 110">
              <span class="process__num">{{ $index + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p class="muted">{{ s.text }}</p>
              <span class="process__tools">{{ s.tools }}</span>
            </li>
          }
        </ol>
      </div>
    </section>

    <!-- STACK (marquee) -->
    <section class="section section--tight">
      <div class="container">
        <p class="stack-title muted" appReveal>{{ t().home.stackTitle }}</p>
      </div>
      <div class="marquee" appReveal>
        <div class="marquee__track">
          @for (s of marquee; track $index) {
            <span class="marquee__item" [attr.aria-hidden]="$index >= p.stack.length ? 'true' : null">{{ s }}</span>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="band" appReveal>
          <div>
            <h2>{{ t().home.band.title }}</h2>
            <p>{{ t().home.band.text }}</p>
          </div>
          <a routerLink="/contact" class="btn btn--light btn--lg">
            {{ t().home.band.button }} <app-icon name="arrow-right" />
          </a>
        </div>
      </div>
    </section>
  `,
})
export class Home {
  protected readonly t = inject(I18n).t;
  protected readonly p = PROFILE;
  protected readonly photoOk = signal(true);
  // Lista duplicada: a animação desloca -50% e recomeça sem "salto" visível.
  protected readonly marquee = [...PROFILE.stack, ...PROFILE.stack];
}
