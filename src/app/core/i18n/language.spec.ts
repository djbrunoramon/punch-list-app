import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { provideI18nTesting } from '../../../testing/i18n';
import { LANGUAGE_STORAGE_KEY, Language, languageFromBrowser } from './language';

describe('Language', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideI18nTesting()] });
  });

  afterEach(() => vi.restoreAllMocks());

  function create(browserLanguage = 'en-US'): Language {
    vi.spyOn(TestBed.inject(DOCUMENT).defaultView!.navigator, 'language', 'get').mockReturnValue(
      browserLanguage,
    );
    return TestBed.inject(Language);
  }

  it.each([
    ['pt-BR', 'pt-BR'],
    ['pt-PT', 'pt-BR'],
    ['pt', 'pt-BR'],
    ['en-US', 'en'],
    ['es-ES', 'en'],
    [undefined, 'en'],
  ])('maps the browser language %s to %s', (browser, expected) => {
    expect(languageFromBrowser(browser)).toBe(expected);
  });

  it('starts with the browser language on the first visit', () => {
    const language = create('pt-BR');

    expect(language.current()).toBe('pt-BR');
    expect(language.locale()).toBe('pt-BR');
    expect(TestBed.inject(TranslocoService).getActiveLang()).toBe('pt-BR');
    expect(document.documentElement.lang).toBe('pt-BR');
  });

  it('prefers the saved choice over the browser language', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');

    expect(create('pt-BR').current()).toBe('en');
  });

  it('ignores an invalid saved value', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, '<script>');

    expect(create('pt-BR').current()).toBe('pt-BR');
  });

  it('switches, persists the choice and updates <html lang> and Transloco', () => {
    const language = create('en-US');

    language.use('pt-BR');

    expect(language.current()).toBe('pt-BR');
    expect(language.locale()).toBe('pt-BR');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pt-BR');
    expect(document.documentElement.lang).toBe('pt-BR');
    expect(TestBed.inject(TranslocoService).translate('shell.nav.dashboard')).toBe('Painel');

    language.use('en');
    expect(language.locale()).toBe('en-US');
    expect(TestBed.inject(TranslocoService).translate('shell.nav.dashboard')).toBe('Dashboard');
  });
});
