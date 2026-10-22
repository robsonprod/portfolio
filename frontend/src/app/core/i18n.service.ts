import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { EN } from '../content/en';
import { PT } from '../content/pt';
import { Content, Lang } from '../content/types';

const CONTENT: Record<Lang, Content> = { en: EN, pt: PT };
const STORAGE_KEY = 'lang';

/**
 * i18n em runtime com signals.
 * O i18n nativo do Angular (@angular/localize) gera um build por idioma — melhor para SEO,
 * mas não permite trocar o idioma com um clique sem recarregar. Aqui o HTML pré-renderizado
 * sai em inglês (idioma principal para recrutadores) e o português é aplicado no navegador.
 */
@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly lang = signal<Lang>('en');
  readonly t = computed(() => CONTENT[this.lang()]);

  /** Chamado após a hidratação: o servidor sempre renderiza em inglês. */
  restore(): void {
    if (!this.isBrowser) return;
    // Inglês é o padrão (público-alvo: recrutadores). Português só se o visitante escolheu antes.
    if (safeGet(STORAGE_KEY) === 'pt') this.apply('pt');
  }

  toggle(): void {
    const next: Lang = this.lang() === 'en' ? 'pt' : 'en';
    this.apply(next);
    safeSet(STORAGE_KEY, next);
  }

  private apply(lang: Lang): void {
    this.lang.set(lang);
    this.doc.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    this.title.setTitle(CONTENT[lang].meta.title);
    this.meta.updateTag({ name: 'description', content: CONTENT[lang].meta.description });
  }
}

// localStorage pode lançar exceção (modo privado, cookies bloqueados).
export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* sem persistência, sem problema */
  }
}
