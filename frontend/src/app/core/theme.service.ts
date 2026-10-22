import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { safeSet } from './i18n.service';

/**
 * O tema inicial é aplicado por public/theme-init.js ANTES do Angular carregar (evita o "flash" branco).
 * Este serviço só cuida da troca. O ícone sol/lua é escolhido via CSS ([data-theme]),
 * então o HTML do servidor e do navegador são idênticos — sem conflito na hidratação.
 */
@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  toggle(origin?: MouseEvent): void {
    if (!this.isBrowser) return;
    const root = this.doc.documentElement;
    const next = root.dataset['theme'] === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset['theme'] = next;
      safeSet('theme', next);
    };

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.doc.startViewTransition || reduceMotion || !origin) {
      apply();
      return;
    }

    // Efeito "círculo que se expande" a partir do botão, usando a View Transitions API.
    const x = origin.clientX;
    const y = origin.clientY;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add('theme-transition');
    const transition = this.doc.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
    transition.finished.finally(() => root.classList.remove('theme-transition'));
  }
}
