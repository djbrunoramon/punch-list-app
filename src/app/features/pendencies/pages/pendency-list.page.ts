import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiBadge, TuiPagination } from '@taiga-ui/kit';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PageState } from '../../../shared/ui/page-state';
import { PendenciesApi } from '../data-access/pendencies.api';
import { PendencyStatus } from '../data-access/pendencies.models';

const PAGE_SIZE = 10;

/** Pendencies of the selected contract (EXT-02), paginated by the server. */
@Component({
  selector: 'app-pendency-list-page',
  imports: [RouterLink, DatePipe, TuiButton, TuiBadge, TuiBlockStatus, TuiPagination, PageState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pendency-list.page.html',
})
export class PendencyListPage {
  private readonly api = inject(PendenciesApi);
  private readonly context = inject(ContractContext);

  protected readonly contractId = this.context.selectedId;
  protected readonly contractsLoading = this.context.contracts.isLoading;
  protected readonly contractsError = this.context.error;

  protected readonly statusAppearance: Readonly<Record<PendencyStatus, string>> = {
    OPEN: 'info',
    CLOSED: 'positive',
    DISAPPROVED: 'negative',
    CANCELED: 'neutral',
  };

  /** Zero-based; goes back to the first page whenever the contract changes. */
  protected readonly page = linkedSignal<number | null, number>({
    source: this.contractId,
    computation: () => 0,
  });

  protected readonly pendencies = rxResource({
    params: () => {
      const contractId = this.contractId();
      return contractId === null ? undefined : { contractId, page: this.page() };
    },
    stream: ({ params }) =>
      this.api.listByContract(params.contractId, {
        page: params.page,
        size: PAGE_SIZE,
        sort: 'createdAt,desc',
      }),
  });

  protected readonly rows = computed(() =>
    this.pendencies.hasValue() ? this.pendencies.value().content : [],
  );
  protected readonly totalPages = computed(() =>
    this.pendencies.hasValue() ? this.pendencies.value().page.totalPages : 0,
  );

  protected reloadContracts(): void {
    this.context.reload();
  }
}
