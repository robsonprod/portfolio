import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18n } from '../../core/i18n.service';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './experience.scss',
  template: `
    <section class="section page-hero">
      <div class="container">
        <header class="section-head" appReveal>
          <p class="eyebrow">{{ t().experience.eyebrow }}</p>
          <h1>{{ t().experience.title }}</h1>
          <p class="muted">{{ t().experience.subtitle }}</p>
        </header>

        <ol class="timeline">
          @for (job of t().experience.jobs; track job.company + job.period; let first = $first) {
            <li class="timeline__item" appReveal>
              <span class="timeline__dot" [class.current]="first"><app-icon name="briefcase" /></span>
              <article class="card job">
                <header class="job__head">
                  <div>
                    <h2 class="job__role">{{ job.role }}</h2>
                    <p class="job__company">
                      {{ job.company }}
                      @if (job.client) {
                        <span class="muted"> · {{ t().experience.clientLabel }}: {{ job.client }}</span>
                      }
                    </p>
                  </div>
                  <div class="job__meta">
                    <span class="pill" [class.pill--accent]="first">{{ job.period }}</span>
                    <span class="muted small">{{ job.location }}</span>
                  </div>
                </header>
                <ul class="job__list">
                  @for (h of job.highlights; track $index) {
                    <li>{{ h }}</li>
                  }
                </ul>
                <ul class="tags">
                  @for (s of job.stack; track s) {
                    <li>{{ s }}</li>
                  }
                </ul>
              </article>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <header class="section-head" appReveal>
          <h2>{{ t().experience.skillsTitle }}</h2>
        </header>
        <div class="skills">
          @for (g of t().experience.skills; track $index) {
            <div class="card" appReveal [revealDelay]="$index * 70">
              <h3>{{ g.name }}</h3>
              <ul class="tags">
                @for (i of g.items; track i) {
                  <li>{{ i }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <div class="edu">
          <div appReveal>
            <h2 class="edu__title"><app-icon name="graduation" /> {{ t().experience.educationTitle }}</h2>
            <ul class="edu__list">
              @for (e of t().experience.education; track $index) {
                <li>
                  <strong>{{ e.title }}</strong>
                  <span class="muted small">{{ e.institution }}{{ e.period ? ' · ' + e.period : '' }}</span>
                </li>
              }
            </ul>
          </div>
          <div appReveal [revealDelay]="100">
            <h2 class="edu__title"><app-icon name="globe" /> {{ t().experience.languagesTitle }}</h2>
            <ul class="edu__list">
              @for (l of t().experience.languages; track l) {
                <li><strong>{{ l }}</strong></li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Experience {
  protected readonly t = inject(I18n).t;
}
