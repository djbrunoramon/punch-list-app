import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiInput, TuiNotification } from '@taiga-ui/core';
import { TuiBlockStatus, TuiForm } from '@taiga-ui/layout';
import { firstValueFrom } from 'rxjs';
import { toApiError } from '../../../core/api-error/api-error';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PageState } from '../../../shared/ui/page-state';
import { toServerFieldErrors } from '../../../shared/util/server-errors';
import { ResponsiblePersonsApi } from '../data-access/responsible-persons.api';
import {
  RESPONSIBLE_PERSON_LIMITS,
  ResponsiblePerson,
  ResponsiblePersonRequest,
} from '../data-access/responsible-persons.models';

interface ResponsiblePersonFormModel {
  name: string;
  occupation: string;
  department: string;
}

const EMPTY: ResponsiblePersonFormModel = { name: '', occupation: '', department: '' };

function toModel(person: ResponsiblePerson): ResponsiblePersonFormModel {
  return { name: person.name, occupation: person.occupation, department: person.department };
}

function toRequest(
  idContract: number,
  model: ResponsiblePersonFormModel,
): ResponsiblePersonRequest {
  return {
    idContract,
    name: model.name.trim(),
    occupation: model.occupation.trim(),
    department: model.department.trim(),
  };
}

/**
 * Create (`/responsible-persons/new`) and edit (`/responsible-persons/:id`) a responsible person.
 * The contract is the selected one on create, and the record's own on edit.
 */
@Component({
  selector: 'app-responsible-person-form-page',
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
    PageState,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './responsible-person-form.page.html',
})
export class ResponsiblePersonFormPage {
  private readonly api = inject(ResponsiblePersonsApi);
  private readonly context = inject(ContractContext);
  private readonly router = inject(Router);

  /** Route param (`withComponentInputBinding`); absent on `/responsible-persons/new`. */
  readonly id = input<string>();

  private readonly personId = computed(() => {
    const id = Number(this.id());
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  });

  protected readonly limits = RESPONSIBLE_PERSON_LIMITS;
  protected readonly isEdit = computed(() => this.personId() !== null);
  protected readonly contractsLoading = this.context.contracts.isLoading;

  protected readonly person = rxResource({
    params: () => this.personId() ?? undefined,
    stream: ({ params: id }) => this.api.get(id),
  });

  /** Record's contract on edit, selected contract on create. */
  protected readonly contractId = computed(() =>
    this.isEdit()
      ? this.person.hasValue()
        ? this.person.value().contract.id
        : null
      : this.context.selectedId(),
  );

  private readonly model = linkedSignal<ResponsiblePersonFormModel>(() =>
    this.person.hasValue() ? toModel(this.person.value()) : EMPTY,
  );

  /** Non-field error of the last submit (ProblemDetail `detail`). */
  protected readonly submitError = signal<string | null>(null);

  protected readonly form = form(
    this.model,
    (path) => {
      required(path.name, { message: 'Name is required' });
      maxLength(path.name, RESPONSIBLE_PERSON_LIMITS.name);
      required(path.occupation, { message: 'Occupation is required' });
      maxLength(path.occupation, RESPONSIBLE_PERSON_LIMITS.occupation);
      required(path.department, { message: 'Department is required' });
      maxLength(path.department, RESPONSIBLE_PERSON_LIMITS.department);
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
          const id = this.personId();
          try {
            await firstValueFrom(
              id === null ? this.api.create(request) : this.api.update(id, request),
            );
          } catch (error) {
            const apiError = toApiError(error);
            this.submitError.set(apiError.detail);
            return toServerFieldErrors(tree, apiError);
          }
          await this.router.navigate(['/responsible-persons']);
          return undefined;
        },
      },
    },
  );
}
