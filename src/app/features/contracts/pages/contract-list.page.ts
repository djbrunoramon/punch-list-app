import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { Language } from '../../../core/i18n/language';
import { PageState } from '../../../shared/ui/page-state';
import { ContractsApi } from '../data-access/contracts.api';

@Component({
  selector: 'app-contract-list-page',
  imports: [RouterLink, DatePipe, CurrencyPipe, TuiButton, TuiBadge, PageState, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contract-list.page.html',
})
export class ContractListPage {
  private readonly api = inject(ContractsApi);
  protected readonly locale = inject(Language).locale;

  protected readonly contracts = rxResource({ stream: () => this.api.list() });
  protected readonly rows = computed(() =>
    this.contracts.hasValue() ? this.contracts.value() : [],
  );
}
