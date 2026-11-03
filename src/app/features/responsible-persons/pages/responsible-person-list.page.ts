import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiBadge, TuiPagination } from '@taiga-ui/kit';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PageState } from '../../../shared/ui/page-state';
import { ResponsiblePersonsApi } from '../data-access/responsible-persons.api';

const PAGE_SIZE = 10;

/** Responsible persons of the selected contract (EXT-02), paginated by the server. */
@Component({
  selector: 'app-responsible-person-list-page',
  imports: [RouterLink, DatePipe, TuiButton, TuiBadge, TuiBlockStatus, TuiPagination, PageState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './responsible-person-list.page.html',
})
export class ResponsiblePersonListPage {
  private readonly api = inject(ResponsiblePersonsApi);
  private readonly context = inject(ContractContext);

  protected readonly contractId = this.context.selectedId;
  protected readonly contractsLoading = this.context.contracts.isLoading;

  /** Zero-based; goes back to the first page whenever the contract changes. */
  protected readonly page = linkedSignal<number | null, number>({
    source: this.contractId,
    computation: () => 0,
  });

  protected readonly people = rxResource({
    params: () => {
      const contractId = this.contractId();
      return contractId === null ? undefined : { contractId, page: this.page() };
    },
    stream: ({ params }) =>
      this.api.listByContract(params.contractId, {
        page: params.page,
        size: PAGE_SIZE,
        sort: 'createdAt,asc',
      }),
  });

  protected readonly rows = computed(() =>
    this.people.hasValue() ? this.people.value().content : [],
  );
  protected readonly totalPages = computed(() =>
    this.people.hasValue() ? this.people.value().page.totalPages : 0,
  );
}
