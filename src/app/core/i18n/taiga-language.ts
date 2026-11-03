import { Provider, computed, inject } from '@angular/core';
import { TUI_ENGLISH_LANGUAGE, TUI_LANGUAGE, TUI_PORTUGUESE_LANGUAGE } from '@taiga-ui/i18n';
import { Language } from './language';

/** Taiga's own texts (pagination, selects, errors...) follow the app language. */
export function provideTaigaLanguage(): Provider {
  return {
    provide: TUI_LANGUAGE,
    useFactory: () => {
      const language = inject(Language);
      return computed(() =>
        language.current() === 'pt-BR' ? TUI_PORTUGUESE_LANGUAGE : TUI_ENGLISH_LANGUAGE,
      );
    },
  };
}
