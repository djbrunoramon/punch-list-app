import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideTaiga } from '@taiga-ui/core';
import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/api-error/api-error.interceptor';
import { acceptLanguageInterceptor } from './core/i18n/accept-language.interceptor';
import { APP_LANGUAGES, DEFAULT_LANGUAGE, Language } from './core/i18n/language';
import { provideTaigaLanguage } from './core/i18n/taiga-language';
import { TranslatedTitleStrategy } from './core/i18n/translated-title-strategy';
import { TranslocoHttpLoader } from './core/i18n/transloco-http-loader';

registerLocaleData(localePt, 'pt-BR');

// Zoneless change detection is the Angular 22 default (no zone.js in the bundle).
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useExisting: TranslatedTitleStrategy },
    provideHttpClient(
      withFetch(),
      withInterceptors([acceptLanguageInterceptor, apiErrorInterceptor]),
    ),
    provideTransloco({
      config: {
        availableLangs: [...APP_LANGUAGES],
        defaultLang: DEFAULT_LANGUAGE,
        fallbackLang: DEFAULT_LANGUAGE,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: { logMissingKey: isDevMode(), useFallbackTranslation: true },
      },
      loader: TranslocoHttpLoader,
    }),
    provideTaiga(),
    provideTaigaLanguage(),
    // Resolves the initial language (saved choice or browser) before the first render.
    provideAppInitializer(() => {
      inject(Language);
    }),
  ],
};
