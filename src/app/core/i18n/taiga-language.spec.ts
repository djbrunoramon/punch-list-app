import { TestBed } from '@angular/core/testing';
import { TUI_ENGLISH_LANGUAGE, TUI_LANGUAGE, TUI_PORTUGUESE_LANGUAGE } from '@taiga-ui/i18n';
import { provideI18nTesting } from '../../../testing/i18n';
import { Language } from './language';
import { provideTaigaLanguage } from './taiga-language';

describe('provideTaigaLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideI18nTesting(), provideTaigaLanguage()] });
  });

  it('gives Taiga the texts of the current language', () => {
    const language = TestBed.inject(Language);
    const taiga = TestBed.inject(TUI_LANGUAGE);

    language.use('en');
    expect(taiga()).toBe(TUI_ENGLISH_LANGUAGE);

    language.use('pt-BR');
    expect(taiga()).toBe(TUI_PORTUGUESE_LANGUAGE);
  });
});
