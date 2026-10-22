import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header';
import { I18n } from './core/i18n.service';
import { PROFILE } from './content/profile';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-header />
    <main id="main" class="page">
      <router-outlet />
    </main>
    <footer class="footer">
      <div class="container footer__inner">
        <span>© {{ year }} {{ name }}</span>
        <span class="muted">{{ t().footer.built }}</span>
      </div>
    </footer>
  `,
})
export class App {
  private readonly i18n = inject(I18n);
  protected readonly t = this.i18n.t;
  protected readonly name = PROFILE.name;
  protected readonly year = new Date().getFullYear();

  constructor() {
    // Só depois da hidratação: o HTML pré-renderizado é sempre em inglês.
    afterNextRender(() => this.i18n.restore());
  }
}
