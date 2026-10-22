import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Efeito "lanterna" que segue o mouse no card.
 * Só atualiza duas CSS custom properties; quem desenha é o CSS (radial-gradient).
 * Listener registrado manualmente (e não via host '(pointermove)') para não disparar
 * change detection a cada pixel que o mouse anda.
 */
@Directive({
  selector: '[appSpotlight]',
  host: { class: 'spotlight' },
})
export class Spotlight {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const move = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
        el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
      };
      el.addEventListener('pointermove', move, { passive: true });
      destroyRef.onDestroy(() => el.removeEventListener('pointermove', move));
    });
  }
}
