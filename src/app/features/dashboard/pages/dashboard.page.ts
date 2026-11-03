import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormField, form } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TuiAxes, TuiBarChart, TuiLegendItem, TuiPieChart } from '@taiga-ui/addon-charts';
import { TuiButton, TuiInput } from '@taiga-ui/core';
import { TuiSelect } from '@taiga-ui/kit';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PageState } from '../../../shared/ui/page-state';
import { PENDENCY_STATUSES, PendencyStatus } from '../../pendencies/data-access/pendencies.models';
import { DashboardApi } from '../data-access/dashboard.api';

/** Pendencies of the selected contract by status (pie) and by priority (bars, per status). */
@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterLink,
    FormField,
    TuiAxes,
    TuiBarChart,
    TuiBlockStatus,
    TuiButton,
    TuiInput,
    TuiLegendItem,
    TuiPieChart,
    TuiSelect,
    PageState,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly api = inject(DashboardApi);
  private readonly context = inject(ContractContext);

  protected readonly contractId = this.context.selectedId;
  protected readonly contractsLoading = this.context.contracts.isLoading;
  protected readonly contractsError = this.context.error;

  protected readonly statuses = PENDENCY_STATUSES;
  /** Status the bars are filtered by; edited through the select. */
  private readonly status = signal<PendencyStatus>('OPEN');
  protected readonly filter = form(this.status);

  protected readonly byStatus = rxResource({
    params: () => this.contractId() ?? undefined,
    stream: ({ params: contractId }) => this.api.byStatus(contractId),
  });

  protected readonly byPriority = rxResource({
    params: () => {
      const contractId = this.contractId();
      return contractId === null ? undefined : { contractId, status: this.status() };
    },
    stream: ({ params }) => this.api.byPriority(params.contractId, params.status),
  });

  protected readonly statusCounts = computed(() =>
    this.byStatus.hasValue() ? this.byStatus.value() : [],
  );
  protected readonly total = computed(() =>
    this.statusCounts().reduce((sum, { quantity }) => sum + quantity, 0),
  );

  /**
   * Only non-zero values go to the pie: TuiPieChart 5.31 draws a zero slice that follows a full
   * circle (e.g. [3, 0, 0, 0]) as an almost complete circle.
   */
  protected readonly pieValues = computed(() =>
    this.statusCounts()
      .map(({ quantity }) => quantity)
      .filter((quantity) => quantity > 0),
  );

  /** Legend: drawn statuses share their slice color (by slice index); empty ones are neutral. */
  protected readonly legend = computed(() => {
    let slice = 0;
    return this.statusCounts().map((item) => ({
      ...item,
      color:
        item.quantity > 0
          ? `var(--tui-chart-categorical-${String(slice++).padStart(2, '0')})`
          : 'var(--tui-background-neutral-2)',
    }));
  });

  protected readonly priorityCounts = computed(() =>
    this.byPriority.hasValue() ? this.byPriority.value() : [],
  );
  protected readonly priorityLabels = computed(() => this.priorityCounts().map((p) => p.priority));
  /** `TuiBarChart` takes one list per series, each with one value per x label: a single series. */
  protected readonly priorityValues = computed(() => [
    this.priorityCounts().map((p) => p.quantity),
  ]);
  protected readonly priorityMax = computed(() =>
    Math.max(1, ...this.priorityCounts().map((p) => p.quantity)),
  );
  protected readonly priorityAxis = computed(() => {
    const max = this.priorityMax();
    return ['0', String(Math.round(max / 2)), String(max)];
  });
  protected readonly priorityDescription = computed(
    () =>
      `Pendencies ${this.status()} by priority: ` +
      this.priorityCounts()
        .map((p) => `${p.priority}: ${p.quantity}`)
        .join(', '),
  );

  protected reloadContracts(): void {
    this.context.reload();
  }
}
