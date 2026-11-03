import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import en from '../../public/i18n/en.json';
import ptBr from '../../public/i18n/pt-BR.json';
import { APP_LANGUAGES, AppLanguage } from '../app/core/i18n/language';

/** Real translation files, so specs assert on the texts users see. */
export const TRANSLATIONS = { en, 'pt-BR': ptBr } as const;

/**
 * Transloco for specs: real `en.json`/`pt-BR.json`, preloaded (synchronous), `en` active by default.
 * Add it to the `providers` of every spec that renders translated templates.
 */
export function provideI18nTesting(lang: AppLanguage = 'en'): EnvironmentProviders {
  return importProvidersFrom(
    TranslocoTestingModule.forRoot({
      langs: TRANSLATIONS,
      preloadLangs: true,
      translocoConfig: {
        availableLangs: [...APP_LANGUAGES],
        defaultLang: lang,
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        missingHandler: { logMissingKey: false, useFallbackTranslation: true },
      },
    }),
  );
}
