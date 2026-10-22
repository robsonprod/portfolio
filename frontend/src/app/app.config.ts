import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // View Transitions API: o navegador tira um "print" da página antiga e anima para a nova.
      // As animações em si estão no CSS (::view-transition-old/new em styles.scss).
      withViewTransitions({ skipInitialTransition: true }),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withFetch()),
    // Sem withEventReplay(): ele injeta <script> inline, o que impediria a CSP estrita (script-src 'self').
    provideClientHydration(),
  ],
};
