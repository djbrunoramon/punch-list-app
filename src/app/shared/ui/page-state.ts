import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TuiButton, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { ApiError } from '../../core/api-error/api-error';

/**
 * Renders loading / error / empty states and projects the content otherwise.
 *
 * ```html
 * <app-page-state [loading]="res.isLoading()" [error]="res.error()" [empty]="!rows().length"
 *                 emptyText="No contracts yet" (retry)="res.reload()">
 *   ...content...
 * </app-page-state>
 * ```
 */
@Component({
  selector: 'app-page-state',
  imports: [TuiLoader, TuiNotification, TuiButton, TuiBlockStatus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error(); as err) {
      <div tuiNotification appearance="negative" role="alert" data-testid="page-error">
        {{ message(err) }}
        <button tuiButton type="button" size="s" appearance="secondary" (click)="retry.emit()">
          Try again
        </button>
      </div>
    } @else if (loading()) {
      <tui-loader size="l" class="state" data-testid="page-loading" />
    } @else if (empty()) {
      <tui-block-status class="state" data-testid="page-empty">
        <h4>{{ emptyText() }}</h4>
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
  readonly emptyText = input('Nothing here yet');
  readonly retry = output();

  protected message(error: unknown): string {
    return error instanceof ApiError ? error.detail : 'Something went wrong. Please try again.';
  }
}
