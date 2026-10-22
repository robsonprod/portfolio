import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Contact } from './contact';
import { I18n } from '../../core/i18n.service';

describe('Contact', () => {
  let http: HttpTestingController;

  function setup() {
    TestBed.configureTestingModule({
      imports: [Contact],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    return fixture;
  }

  function fill(el: HTMLElement, values: { name: string; email: string; message: string }) {
    for (const [field, value] of Object.entries(values)) {
      const input = el.querySelector<HTMLInputElement>(`[formcontrolname=${field}]`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
  }

  const submit = (el: HTMLElement) => el.querySelector<HTMLButtonElement>('button[type=submit]')!.click();

  afterEach(() => http.verify());

  it('does not send when the form is invalid', () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    fill(el, { name: '', email: 'invalid', message: 'short' });

    submit(el);
    fixture.detectChanges();

    http.expectNone('/api/contact');
    expect(el.querySelectorAll('.err').length).toBeGreaterThan(0);
  });

  it('sends the payload with an empty honeypot and shows success', () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    fill(el, { name: 'Recruiter', email: 'hr@company.com', message: 'We have a senior role for you.' });

    submit(el);
    const req = http.expectOne('/api/contact');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.website).toBe('');
    req.flush(null, { status: 202, statusText: 'Accepted' });
    fixture.detectChanges();

    expect(el.textContent).toContain('Message sent!');
  });

  it('shows a specific message on HTTP 429 (rate limit)', () => {
    const fixture = setup();
    const el: HTMLElement = fixture.nativeElement;
    fill(el, { name: 'Bot', email: 'bot@x.com', message: 'repeated message many times' });

    submit(el);
    http.expectOne('/api/contact').flush(null, { status: 429, statusText: 'Too Many Requests' });
    fixture.detectChanges();

    expect(el.textContent).toContain('Too many attempts');
  });

  it('switches the labels to Portuguese', () => {
    const fixture = setup();
    TestBed.inject(I18n).toggle();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Envie uma mensagem');
  });
});
