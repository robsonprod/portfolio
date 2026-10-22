import { Directive, ElementRef, PLATFORM_ID, afterNextRender, inject, input, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Anima o elemento quando ele entra na tela (IntersectionObserver).
 * Sem JS, o conteúdo aparece normalmente: o estado "escondido" só vale com a classe .js no <html>.
 * Uso: <div appReveal [revealDelay]="100">
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[style.--reveal-delay.ms]': 'revealDelay()' },
})
export class Reveal {
  readonly revealDelay = input(0);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            observer.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
