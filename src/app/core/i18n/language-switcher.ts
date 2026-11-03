import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton } from '@taiga-ui/core';
import { APP_LANGUAGES, AppLanguage, Language } from './language';

/** EN / PT-BR switch in the header (segmented buttons, the active one is pressed). */
@Component({
  selector: 'app-language-switcher',
  imports: [TuiButton, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switcher" role="group" [attr.aria-label]="'shell.language.label' | transloco">
      @for (option of languages; track option) {
        <button
          tuiButton
          type="button"
          size="xs"
          [appearance]="language.current() === option ? 'secondary' : 'flat'"
          [attr.aria-pressed]="language.current() === option"
          [attr.lang]="option"
          [attr.title]="labels[option].name | transloco"
          [attr.data-testid]="'language-' + option"
          (click)="select(option)"
        >
          {{ labels[option].short | transloco }}
        </button>
      }
    </div>
  `,
  styles: `
    .switcher {
      display: flex;
      gap: 0.25rem;
    }
  `,
})
export class LanguageSwitcher {
  protected readonly language = inject(Language);
  protected readonly languages = APP_LANGUAGES;

  /** Literal keys (searchable) per language. */
  protected readonly labels: Readonly<Record<AppLanguage, { short: string; name: string }>> = {
    en: { short: 'shell.language.short.en', name: 'shell.language.name.en' },
    'pt-BR': { short: 'shell.language.short.ptBr', name: 'shell.language.name.ptBr' },
  };

  protected select(language: AppLanguage): void {
    if (language !== this.language.current()) {
      this.language.use(language);
    }
  }
}
