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
import { FormField, FormRoot, form, maxLength } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiInput, TuiNotification } from '@taiga-ui/core';
import { TuiBlockStatus, TuiForm } from '@taiga-ui/layout';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { toApiError } from '../../../core/api-error/api-error';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { PageState } from '../../../shared/ui/page-state';
import { requiredText } from '../../../shared/util/required-text';
import { injectValidationMessages } from '../../../shared/util/validation-messages';
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
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './responsible-person-form.page.html',
})
export class ResponsiblePersonFormPage {
  private readonly api = inject(ResponsiblePersonsApi);
  private readonly transloco = inject(TranslocoService);
  private readonly message = injectValidationMessages();
  private readonly maxLength = (field: keyof typeof RESPONSIBLE_PERSON_LIMITS) => ({
    message: this.message('validation.maxLength', { max: RESPONSIBLE_PERSON_LIMITS[field] }),
  });
  private readonly context = inject(ContractContext);
  private readonly router = inject(Router);

  /** Set on destroy: a response that arrives later must not navigate nor touch signals. */
  private destroyed = false;
  private readonly destroyHook = inject(DestroyRef).onDestroy(() => (this.destroyed = true));

  /** Route param (`withComponentInputBinding`); absent on `/responsible-persons/new`. */
  readonly id = input<string>();

  private readonly personId = computed(() => {
    const id = Number(this.id());
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  });

  protected readonly limits = RESPONSIBLE_PERSON_LIMITS;
  protected readonly isEdit = computed(() => this.personId() !== null);
  protected readonly contractsLoading = this.context.contracts.isLoading;
  protected readonly contractsError = this.context.error;

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

  /** Reset when the record loads, or when the selected contract changes while creating. */
  private readonly model = linkedSignal<
    { person: ResponsiblePerson | null; contractId: number | null },
    ResponsiblePersonFormModel
  >({
    source: () => ({
      person: this.person.hasValue() ? this.person.value() : null,
      contractId: this.contractId(),
    }),
    computation: ({ person }) => (person ? toModel(person) : EMPTY),
  });

  /** Non-field error of the last submit; cleared together with the model on a contract change. */
  protected readonly submitError = linkedSignal<number | null, string | null>({
    source: this.contractId,
    computation: () => null,
  });

  protected readonly form = form(
    this.model,
    (path) => {
      const required = { message: this.message('validation.required') };
      requiredText(path.name, required);
      maxLength(path.name, RESPONSIBLE_PERSON_LIMITS.name, this.maxLength('name'));
      requiredText(path.occupation, required);
      maxLength(
        path.occupation,
        RESPONSIBLE_PERSON_LIMITS.occupation,
        this.maxLength('occupation'),
      );
      requiredText(path.department, required);
      maxLength(
        path.department,
        RESPONSIBLE_PERSON_LIMITS.department,
        this.maxLength('department'),
      );
    },
    {
      submission: {
        action: async (tree) => {
          this.submitError.set(null);
          const contractId = this.contractId();
          if (contractId === null) {
            this.submitError.set(
              this.transloco.translate('responsiblePersons.message.selectContractToCreate'),
            );
            return undefined;
          }
          const request = toRequest(contractId, this.model());
          const id = this.personId();
          try {
            await firstValueFrom(
              id === null ? this.api.create(request) : this.api.update(id, request),
            );
          } catch (error) {
            if (this.destroyed) {
              return undefined;
            }
            const apiError = toApiError(error, (key) => this.transloco.translate(key));
            this.submitError.set(apiError.detail);
            return toServerFieldErrors(tree, apiError);
          }
          if (this.destroyed) {
            return undefined;
          }
          await this.router.navigate(['/responsible-persons']);
          return undefined;
        },
      },
    },
  );

  protected reloadContracts(): void {
    this.context.reload();
  }
}
