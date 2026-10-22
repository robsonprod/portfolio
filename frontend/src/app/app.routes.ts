import { Routes } from '@angular/router';

// Lazy loading: cada página é um chunk separado, baixado só quando a rota é visitada.
// No build estático, todas são pré-renderizadas (ver app.routes.server.ts).
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'experience', loadComponent: () => import('./pages/experience/experience').then((m) => m.Experience) },
  { path: 'projects', loadComponent: () => import('./pages/projects/projects').then((m) => m.Projects) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: '**', redirectTo: '' },
];
