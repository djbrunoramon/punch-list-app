import { Injector, Signal, inject } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

/** A translated message that follows the current language; usable as a Signal Forms `message`. */
export type ValidationMessage = () => string;

/**
 * Returns a factory of language-reactive validation messages (keys under `validation.*`, see
 * `docs/conhecimento/modulos/i18n.md`). Call it in an injection context (field initializer) before creating the form.
 *
 * ```ts
 * private readonly message = injectValidationMessages();
 * maxLength(path.name, 120, { message: this.message('validation.maxLength', { max: 120 }) });
 * ```
 */
export function injectValidationMessages(): (
  key: string,
  params?: Readonly<Record<string, string | number>>,
) => ValidationMessage {
  const injector = inject(Injector);
  const cache = new Map<string, Signal<string>>();
  return (key, params) => {
    const id = `${key}|${JSON.stringify(params ?? {})}`;
    let text = cache.get(id);
    if (!text) {
      text = translateSignal(key, { ...params }, undefined, injector);
      cache.set(id, text);
    }
    const translated = text;
    return () => translated();
  };
}
