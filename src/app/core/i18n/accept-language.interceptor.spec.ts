import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideI18nTesting } from '../../../testing/i18n';
import { acceptLanguageInterceptor } from './accept-language.interceptor';
import { Language } from './language';

describe('acceptLanguageInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideI18nTesting(),
        provideHttpClient(withInterceptors([acceptLanguageInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('sends the current language and follows a language change', () => {
    const language = TestBed.inject(Language);
    language.use('en');

    http.get('/api/v1/contract').subscribe();
    expect(httpTesting.expectOne('/api/v1/contract').request.headers.get('Accept-Language')).toBe(
      'en',
    );

    language.use('pt-BR');
    http.get('/api/v1/contract').subscribe();
    expect(httpTesting.expectOne('/api/v1/contract').request.headers.get('Accept-Language')).toBe(
      'pt-BR',
    );
  });
});
