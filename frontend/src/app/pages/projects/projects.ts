import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18n } from '../../core/i18n.service';
import { PROFILE } from '../../content/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { Spotlight } from '../../shared/spotlight.directive';

// Para adicionar um projeto: inclua um item em projects.items no en.ts e no pt.ts.
@Component({
  selector: 'app-projects',
  imports: [Icon, Reveal, Spotlight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.scss',
  template: `
    <section class="section page-hero">
      <div class="container">
        <header class="section-head" appReveal>
          <p class="eyebrow">{{ t().projects.eyebrow }}</p>
          <h1>{{ t().projects.title }}</h1>
          <p class="muted">{{ t().projects.subtitle }}</p>
        </header>

        <div class="projects">
          @for (pr of t().projects.items; track pr.name) {
            <article class="card project" appReveal appSpotlight [revealDelay]="$index * 90">
              <header class="project__head">
                <span class="project__icon"><app-icon name="code" /></span>
                <span class="status" [attr.data-status]="pr.status">{{ t().projects.status[pr.status] }}</span>
              </header>
              <h2>{{ pr.name }}</h2>
              <p class="muted">{{ pr.description }}</p>
              <ul class="project__list">
                @for (h of pr.highlights; track $index) {
                  <li><app-icon name="check" /> {{ h }}</li>
                }
              </ul>
              <ul class="tags">
                @for (tag of pr.tags; track tag) {
                  <li>{{ tag }}</li>
                }
              </ul>
              <footer class="project__foot">
                @if (pr.repo) {
                  <a [href]="pr.repo" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm">
                    <app-icon name="github" /> {{ t().projects.viewCode }}
                  </a>
                } @else {
                  <span class="muted small">{{ t().projects.soon }}</span>
                }
              </footer>
            </article>
          }

          <article class="card project project--more" appReveal [revealDelay]="t().projects.items.length * 90">
            <span class="project__icon"><app-icon name="sparkles" /></span>
            <h2>{{ t().projects.moreTitle }}</h2>
            <p class="muted">{{ t().projects.moreText }}</p>
            @if (github) {
              <a [href]="github" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm">
                <app-icon name="github" /> GitHub
              </a>
            }
          </article>
        </div>
      </div>
    </section>
  `,
})
export class Projects {
  protected readonly t = inject(I18n).t;
  protected readonly github = PROFILE.links.github;
}
