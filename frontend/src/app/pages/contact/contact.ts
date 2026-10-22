import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18n } from '../../core/i18n.service';
import { PROFILE } from '../../content/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { ContactService } from './contact.service';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'rate-limited';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './contact.scss',
  template: `
    <section class="section page-hero">
      <div class="container">
        <header class="section-head" appReveal>
          <p class="eyebrow">{{ t().contact.eyebrow }}</p>
          <h1>{{ t().contact.title }}</h1>
          <p class="muted">{{ t().contact.subtitle }}</p>
        </header>

        <div class="contact">
          <aside class="channels" appReveal>
            <h2>{{ t().contact.channelsTitle }}</h2>

            <a class="channel" [href]="email() ? 'mailto:' + email() : null">
              <span class="channel__icon"><app-icon name="mail" /></span>
              <span><strong>Email</strong><span class="muted small">{{ email() || '…' }}</span></span>
            </a>
            <a class="channel" [href]="p.links.linkedin" target="_blank" rel="noopener noreferrer">
              <span class="channel__icon"><app-icon name="linkedin" /></span>
              <span><strong>LinkedIn</strong><span class="muted small">/in/robson-azevedo</span></span>
              <app-icon name="external" class="channel__ext" />
            </a>
            @if (p.links.github) {
              <a class="channel" [href]="p.links.github" target="_blank" rel="noopener noreferrer">
                <span class="channel__icon"><app-icon name="github" /></span>
                <span><strong>GitHub</strong><span class="muted small">{{ githubHandle }}</span></span>
                <app-icon name="external" class="channel__ext" />
              </a>
            }

            <div class="where">
              <p><app-icon name="map-pin" /> {{ t().contact.location }}</p>
              <p><span class="dot"></span> {{ t().contact.availability }}</p>
            </div>
          </aside>

          <div class="card form-card" appReveal [revealDelay]="120">
            @if (status() === 'sent') {
              <div class="sent" role="status">
                <span class="sent__icon"><app-icon name="check" /></span>
                <h2>{{ t().contact.form.sentTitle }}</h2>
                <p class="muted">{{ t().contact.form.sentText }}</p>
              </div>
            } @else {
              <h2>{{ t().contact.form.title }}</h2>
              <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
                <div class="row">
                  <label class="field">
                    <span>{{ t().contact.form.name }}</span>
                    <input formControlName="name" autocomplete="name" maxlength="100" />
                    @if (invalid('name')) { <small class="err">{{ t().contact.form.errors.name }}</small> }
                  </label>
                  <label class="field">
                    <span>{{ t().contact.form.email }}</span>
                    <input formControlName="email" type="email" autocomplete="email" maxlength="254" />
                    @if (invalid('email')) { <small class="err">{{ t().contact.form.errors.email }}</small> }
                  </label>
                </div>
                <label class="field">
                  <span>{{ t().contact.form.message }}</span>
                  <textarea formControlName="message" rows="6" maxlength="2000"></textarea>
                  @if (invalid('message')) { <small class="err">{{ t().contact.form.errors.message }}</small> }
                </label>

                <!-- Honeypot: fora da tela e fora da navegação por teclado -->
                <div class="hp" aria-hidden="true">
                  <label>Website <input formControlName="website" tabindex="-1" autocomplete="off" /></label>
                </div>

                @if (status() === 'error') {
                  <p class="err" role="alert">{{ t().contact.form.error }}</p>
                }
                @if (status() === 'rate-limited') {
                  <p class="err" role="alert">{{ t().contact.form.rateLimited }}</p>
                }

                <button class="btn btn--primary btn--lg" type="submit" [disabled]="status() === 'sending'">
                  {{ status() === 'sending' ? t().contact.form.sending : t().contact.form.send }}
                  <app-icon name="send" />
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Contact {
  private readonly api = inject(ContactService);
  protected readonly t = inject(I18n).t;
  protected readonly p = PROFILE;
  protected readonly githubHandle = PROFILE.links.github.replace('https://github.com/', '@');
  protected readonly status = signal<Status>('idle');

  // E-mail montado só no navegador: não fica no HTML pré-renderizado que bots de scraping leem.
  protected readonly email = signal('');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    website: [''],
  });

  constructor() {
    afterNextRender(() => this.email.set(PROFILE.emailParts.join('@')));
  }

  protected invalid(field: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[field];
    return c.invalid && (c.touched || c.dirty);
  }

  // Validação no front é UX, não segurança: a Lambda valida tudo de novo.
  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.status.set('sending');
    this.api.send(this.form.getRawValue()).subscribe({
      next: () => this.status.set('sent'),
      error: (e) => this.status.set(e?.status === 429 ? 'rate-limited' : 'error'),
    });
  }
}
