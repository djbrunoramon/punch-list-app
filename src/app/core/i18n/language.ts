import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/** Languages the app is translated to (BCP 47). `en` is the base and the fallback. */
export const APP_LANGUAGES = ['en', 'pt-BR'] as const;
export type AppLanguage = (typeof APP_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = 'en';
export const LANGUAGE_STORAGE_KEY = 'lang';

/** Locale used by the `date`/`currency` pipes for each language. */
const LOCALE_BY_LANGUAGE: Readonly<Record<AppLanguage, string>> = { en: 'en-US', 'pt-BR': 'pt-BR' };

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && (APP_LANGUAGES as readonly string[]).includes(value);
}

/** First visit: browser language (`pt*` → `pt-BR`, anything else → `en`). */
export function languageFromBrowser(browserLanguage: string | undefined): AppLanguage {
  return browserLanguage?.toLowerCase().startsWith('pt') ? 'pt-BR' : DEFAULT_LANGUAGE;
}

/**
 * Current UI language. Starts from the saved choice (localStorage `lang`) or the browser language, keeps
 * Transloco and `<html lang>` in sync and persists explicit changes.
 */
@Injectable({ providedIn: 'root' })
export class Language {
  private readonly transloco = inject(TranslocoService);
  private readonly document = inject(DOCUMENT);

  private readonly language = signal<AppLanguage>(this.initial());

  readonly current = this.language.asReadonly();
  readonly locale = computed(() => LOCALE_BY_LANGUAGE[this.language()]);

  constructor() {
    this.apply(this.language());
  }

  use(language: AppLanguage): void {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    this.language.set(language);
    this.apply(language);
  }

  private initial(): AppLanguage {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isAppLanguage(saved)
      ? saved
      : languageFromBrowser(this.document.defaultView?.navigator.language);
  }

  private apply(language: AppLanguage): void {
    this.transloco.setActiveLang(language);
    this.document.documentElement.lang = language;
  }
}
