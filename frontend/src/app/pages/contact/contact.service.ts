import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  /** Honeypot: campo invisível. Humano deixa vazio; bot costuma preencher. */
  website: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  // Caminho relativo: em produção o CloudFront roteia /api/* para o API Gateway,
  // então site e API ficam na mesma origem (sem CORS) e atrás do mesmo WAF.
  send(req: ContactRequest): Observable<void> {
    return this.http.post<void>('/api/contact', req);
  }
}
