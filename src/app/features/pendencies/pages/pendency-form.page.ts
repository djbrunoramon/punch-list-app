import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormField, FormRoot, applyWhen, form, maxLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiInput, TuiNotification } from '@taiga-ui/core';
import { TuiSelect, TuiTextarea } from '@taiga-ui/kit';
import { TuiBlockStatus, TuiForm } from '@taiga-ui/layout';
import { firstValueFrom, map } from 'rxjs';
import { toApiError } from '../../../core/api-error/api-error';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PageState } from '../../../shared/ui/page-state';
import { fromApiDateTime, toApiDateTime } from '../../../shared/util/date-time';
import { requiredText } from '../../../shared/util/required-text';
import { toServerFieldErrors } from '../../../shared/util/server-errors';
import { ResponsiblePersonsApi } from '../../responsible-persons/data-access/responsible-persons.api';
import { PendenciesApi } from '../data-access/pendencies.api';
import {
  PENDENCY_LIMITS,
  PENDENCY_STATUSES,
  Pendency,
  PendencyRequest,
  PendencyStatus,
  PersonSummary,
} from '../data-access/pendencies.models';

/** What the inputs edit: strings for text/date inputs, the chosen person (or null) for selects. */
interface PendencyFormModel {
  areaIdentification: string;
  tag: string;
  description: string;
  priority: string;
  discipline: string;
  status: PendencyStatus;
  registeredBy: PersonSummary | null;
  registeredTo: PersonSummary | null;
  expectedIn: string;
  finishedBy: PersonSummary | null;
  finishedAt: string;
  disapprovedBy: PersonSummary | null;
  disapprovedAt: string;
  canceledBy: PersonSummary | null;
  canceledAt: string;
}

const EMPTY: PendencyFormModel = {
  areaIdentification: '',
  tag: '',
  description: '',
  priority: '',
  discipline: '',
  status: 'OPEN',
  registeredBy: null,
  registeredTo: null,
  expectedIn: '',
  finishedBy: null,
  finishedAt: '',
  disapprovedBy: null,
  disapprovedAt: '',
  canceledBy: null,
  canceledAt: '',
};

function toModel(pendency: Pendency): PendencyFormModel {
  return {
    areaIdentification: pendency.areaIdentification,
    tag: pendency.tag ?? '',
    description: pendency.description,
    priority: pendency.priority,
    discipline: pendency.discipline,
    status: pendency.status,
    registeredBy: pendency.registeredBy,
    registeredTo: pendency.registeredTo,
    expectedIn: fromApiDateTime(pendency.expectedIn),
    finishedBy: pendency.finishedBy,
    finishedAt: fromApiDateTime(pendency.finishedAt),
    disapprovedBy: pendency.disapprovedBy,
    disapprovedAt: fromApiDateTime(pendency.disapprovedAt),
    canceledBy: pendency.canceledBy,
    canceledAt: fromApiDateTime(pendency.canceledAt),
  };
}

/**
 * Only the closure fields of the current status are sent; the others (possibly typed before the
 * status changed) go as `null`. The caller guarantees the required persons are set (validation).
 */
function toRequest(idContract: number, model: PendencyFormModel): PendencyRequest {
  const { status } = model;
  return {
    idContract,
    areaIdentification: model.areaIdentification.trim(),
    tag: model.tag.trim() || null,
    description: model.description.trim(),
    priority: model.priority.trim(),
    status,
    discipline: model.discipline.trim(),
    registeredBy: model.registeredBy?.id ?? 0,
    registeredTo: model.registeredTo?.id ?? 0,
    expectedIn: toApiDateTime(model.expectedIn),
    finishedBy: status === 'CLOSED' ? (model.finishedBy?.id ?? null) : null,
    finishedAt: status === 'CLOSED' ? toApiDateTime(model.finishedAt) : null,
    disapprovedBy: status === 'DISAPPROVED' ? (model.disapprovedBy?.id ?? null) : null,
    disapprovedAt: status === 'DISAPPROVED' ? toApiDateTime(model.disapprovedAt) : null,
    canceledBy: status === 'CANCELED' ? (model.canceledBy?.id ?? null) : null,
    canceledAt: status === 'CANCELED' ? toApiDateTime(model.canceledAt) : null,
  };
}

/** Create (`/pendencies/new`) and edit (`/pendencies/:id`) a pendency. */
@Component({
  selector: 'app-pendency-form-page',
  imports: [
    RouterLink,
    FormRoot,
    FormField,
    TuiBlockStatus,
    TuiButton,
    TuiError,
    TuiForm,
    TuiInput,
    TuiNotification,
    TuiSelect,
    TuiTextarea,
    PageState,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pendency-form.page.html',
})
export class PendencyFormPage {
  private readonly api = inject(PendenciesApi);
  private readonly peopleApi = inject(ResponsiblePersonsApi);
  private readonly context = inject(ContractContext);
  private readonly router = inject(Router);

  /** Set on destroy: a response that arrives later must not navigate nor touch signals. */
  private destroyed = false;
  private readonly destroyHook = inject(DestroyRef).onDestroy(() => (this.destroyed = true));

  /** Route param (`withComponentInputBinding`); absent on `/pendencies/new`. */
  readonly id = input<string>();

  private readonly pendencyId = computed(() => {
    const id = Number(this.id());
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  });

  protected readonly limits = PENDENCY_LIMITS;
  protected readonly statuses = PENDENCY_STATUSES;
  protected readonly isEdit = computed(() => this.pendencyId() !== null);
  protected readonly contractsLoading = this.context.contracts.isLoading;
  protected readonly contractsError = this.context.error;

  protected readonly pendency = rxResource({
    params: () => this.pendencyId() ?? undefined,
    stream: ({ params: id }) => this.api.get(id),
  });

  /** The pendency's own contract on edit, the selected one on create. */
  protected readonly contractId = computed(() =>
    this.isEdit()
      ? this.pendency.hasValue()
        ? this.pendency.value().contract.id
        : null
      : this.context.selectedId(),
  );

  /** Candidates for the responsible selects: the contract's persons (API caps a page at 100). */
  private readonly peopleResource = rxResource({
    params: () => this.contractId() ?? undefined,
    stream: ({ params: contractId }) =>
      this.peopleApi
        .listByContract(contractId, { page: 0, size: 100, sort: 'name,asc' })
        .pipe(map((page) => page.content)),
  });
  protected readonly people = computed<readonly PersonSummary[]>(() =>
    this.peopleResource.hasValue() ? this.peopleResource.value() : [],
  );

  protected readonly loadError = computed<unknown>(
    () => this.pendency.error() ?? this.peopleResource.error(),
  );
  protected readonly loading = computed(
    () => this.pendency.isLoading() || (!this.loadError() && !this.peopleResource.hasValue()),
  );

  /** Reset when the record loads, or when the selected contract changes while creating. */
  private readonly model = linkedSignal<
    { pendency: Pendency | null; contractId: number | null },
    PendencyFormModel
  >({
    source: () => ({
      pendency: this.pendency.hasValue() ? this.pendency.value() : null,
      contractId: this.contractId(),
    }),
    computation: ({ pendency }) => (pendency ? toModel(pendency) : EMPTY),
  });

  protected readonly status = computed(() => this.model().status);

  /** Non-field error of the last submit (ProblemDetail `detail`, e.g. the 422 business rule). */
  /** Non-field error of the last submit; cleared when the contract changes. */
  protected readonly submitError = linkedSignal<number | null, string | null>({
    source: this.contractId,
    computation: () => null,
  });

  protected readonly stringifyPerson = (person: PersonSummary | null): string => person?.name ?? '';
  protected readonly samePerson = (a: PersonSummary | null, b: PersonSummary | null): boolean =>
    a?.id === b?.id;

  protected readonly form = form(
    this.model,
    (path) => {
      requiredText(path.areaIdentification, { message: 'Area is required' });
      maxLength(path.areaIdentification, PENDENCY_LIMITS.areaIdentification);
      maxLength(path.tag, PENDENCY_LIMITS.tag);
      requiredText(path.description, { message: 'Description is required' });
      maxLength(path.description, PENDENCY_LIMITS.description);
      requiredText(path.priority, { message: 'Priority is required' });
      maxLength(path.priority, PENDENCY_LIMITS.priority);
      requiredText(path.discipline, { message: 'Discipline is required' });
      maxLength(path.discipline, PENDENCY_LIMITS.discipline);
      required(path.registeredBy, { message: 'Registered by is required' });
      required(path.registeredTo, { message: 'Registered to is required' });

      // The closure fields are mandatory only while the status asks for them (mirrors the API).
      applyWhen(
        path,
        ({ value }) => value().status === 'CLOSED',
        (closed) => {
          required(closed.finishedBy, { message: 'Finished by is required' });
          required(closed.finishedAt, { message: 'Finished at is required' });
        },
      );
      applyWhen(
        path,
        ({ value }) => value().status === 'DISAPPROVED',
        (disapproved) => {
          required(disapproved.disapprovedBy, { message: 'Disapproved by is required' });
          required(disapproved.disapprovedAt, { message: 'Disapproved at is required' });
        },
      );
      applyWhen(
        path,
        ({ value }) => value().status === 'CANCELED',
        (canceled) => {
          required(canceled.canceledBy, { message: 'Canceled by is required' });
          required(canceled.canceledAt, { message: 'Canceled at is required' });
        },
      );
    },
    {
      submission: {
        action: async (tree) => {
          this.submitError.set(null);
          const contractId = this.contractId();
          if (contractId === null) {
            this.submitError.set('Select a contract first.');
            return undefined;
          }
          const request = toRequest(contractId, this.model());
          const id = this.pendencyId();
          try {
            await firstValueFrom(
              id === null ? this.api.create(request) : this.api.update(id, request),
            );
          } catch (error) {
            if (this.destroyed) {
              return undefined;
            }
            const apiError = toApiError(error);
            this.submitError.set(apiError.detail);
            return toServerFieldErrors(tree, apiError);
          }
          if (this.destroyed) {
            return undefined;
          }
          await this.router.navigate(['/pendencies']);
          return undefined;
        },
      },
    },
  );

  protected reload(): void {
    this.pendency.reload();
    this.peopleResource.reload();
  }

  protected reloadContracts(): void {
    this.context.reload();
  }
}
