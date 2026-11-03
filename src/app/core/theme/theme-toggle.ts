import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TUI_DARK_MODE, TuiButton } from '@taiga-ui/core';

/**
 * Light/dark switch. `TUI_DARK_MODE` follows the OS theme until the user picks one, then persists the
 * choice in localStorage (`tuiDark`); `provideTaiga()` applies it as `tuiTheme="dark"` on the body.
 */
@Component({
  selector: 'app-theme-toggle',
  imports: [TuiButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      tuiIconButton
      type="button"
      size="s"
      appearance="flat"
      [iconStart]="dark() ? '@tui.sun' : '@tui.moon'"
      [attr.aria-label]="label()"
      [attr.aria-pressed]="dark()"
      [attr.title]="label()"
      (click)="dark.set(!dark())"
    ></button>
  `,
})
export class ThemeToggle {
  protected readonly dark = inject(TUI_DARK_MODE);
  protected readonly label = computed(() =>
    this.dark() ? 'Switch to light theme' : 'Switch to dark theme',
  );
}
