import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiButton, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { ApiError } from '../../core/api-error/api-error';

/**
 * Renders loading / error / empty states and projects the content otherwise.
 *
 * ```html
 * <app-page-state [loading]="res.isLoading()" [error]="res.error()" [empty]="!rows().length"
 *                 [emptyText]="'contracts.list.empty' | transloco" (retry)="res.reload()">
 *   ...content...
 * </app-page-state>
 * ```
 */
@Component({
  selector: 'app-page-state',
  imports: [TuiLoader, TuiNotification, TuiButton, TuiBlockStatus, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error(); as err) {
      <div tuiNotification appearance="negative" role="alert" data-testid="page-error">
        {{ message(err) }}
        <button tuiButton type="button" size="s" appearance="secondary" (click)="retry.emit()">
          {{ 'common.action.retry' | transloco }}
        </button>
      </div>
    } @else if (loading()) {
      <tui-loader
        size="l"
        class="state"
        data-testid="page-loading"
        [attr.aria-label]="'common.state.loading' | transloco"
      />
    } @else if (empty()) {
      <tui-block-status class="state" data-testid="page-empty">
        <h4>{{ emptyText() ?? ('common.state.empty' | transloco) }}</h4>
        <ng-content select="[empty-actions]" />
      </tui-block-status>
    } @else {
      <ng-content />
    }
  `,
  styles: `
    .state {
      margin-block: 2rem;
    }
    [tuiNotification] {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
    }
  `,
})
export class PageState {
  readonly loading = input(false);
  readonly error = input<unknown>(undefined);
  readonly empty = input(false);
  /** Already translated text; defaults to `common.state.empty`. */
  readonly emptyText = input<string>();
  readonly retry = output();

  private readonly transloco = inject(TranslocoService);

  protected message(error: unknown): string {
    return error instanceof ApiError ? error.detail : this.transloco.translate('error.unexpected');
  }
}
