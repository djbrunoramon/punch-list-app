import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormField, FormRoot, form, maxLength, min } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiInput, TuiNotification } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { toApiError } from '../../../core/api-error/api-error';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { fromApiDateTime, toApiDateTime } from '../../../shared/util/date-time';
import { requiredText } from '../../../shared/util/required-text';
import { injectValidationMessages } from '../../../shared/util/validation-messages';
import { toServerFieldErrors } from '../../../shared/util/server-errors';
import { PageState } from '../../../shared/ui/page-state';
import { ContractsApi } from '../data-access/contracts.api';
import { CONTRACT_LIMITS, Contract, ContractRequest } from '../data-access/contracts.models';

/** What the inputs edit: strings for text/date inputs, number|null for the numeric one. */
interface ContractFormModel {
  numberContract: string;
  description: string;
  address: string;
  startAt: string;
  scheduledTo: string;
  estimatedAt: number | null;
}

const EMPTY: ContractFormModel = {
  numberContract: '',
  description: '',
  address: '',
  startAt: '',
  scheduledTo: '',
  estimatedAt: null,
};

function toModel(contract: Contract): ContractFormModel {
  return {
    numberContract: contract.numberContract,
    description: contract.description,
    address: contract.address,
    startAt: fromApiDateTime(contract.startAt),
    scheduledTo: fromApiDateTime(contract.scheduledTo),
    estimatedAt: contract.estimatedAt,
  };
}

function toRequest(model: ContractFormModel): ContractRequest {
  return {
    numberContract: model.numberContract.trim(),
    description: model.description.trim(),
    address: model.address.trim(),
    startAt: toApiDateTime(model.startAt),
    scheduledTo: toApiDateTime(model.scheduledTo),
    estimatedAt: model.estimatedAt,
  };
}

/** Create (`/contracts/new`) and edit (`/contracts/:id`) a contract. */
@Component({
  selector: 'app-contract-form-page',
  imports: [
    RouterLink,
    FormRoot,
    FormField,
    TuiButton,
    TuiError,
    TuiForm,
    TuiInput,
    TuiNotification,
    TuiTextarea,
    PageState,
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contract-form.page.html',
})
export class ContractFormPage {
  private readonly api = inject(ContractsApi);
  private readonly context = inject(ContractContext);
  private readonly router = inject(Router);

  /** Set on destroy: a response that arrives later must not navigate nor touch signals. */
  private destroyed = false;
  private readonly destroyHook = inject(DestroyRef).onDestroy(() => (this.destroyed = true));

  /** Route param (`withComponentInputBinding`); absent on `/contracts/new`. */
  readonly id = input<string>();

  private readonly contractId = computed(() => {
    const id = Number(this.id());
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  });

  protected readonly limits = CONTRACT_LIMITS;
  protected readonly isEdit = computed(() => this.contractId() !== null);

  protected readonly contract = rxResource({
    params: () => this.contractId() ?? undefined,
    stream: ({ params: id }) => this.api.get(id),
  });

  private readonly model = linkedSignal<ContractFormModel>(() =>
    this.contract.hasValue() ? toModel(this.contract.value()) : EMPTY,
  );

  /** Non-field error of the last submit (ProblemDetail `detail`). */
  protected readonly submitError = signal<string | null>(null);

  private readonly transloco = inject(TranslocoService);
  private readonly message = injectValidationMessages();
  private readonly maxLength = (field: keyof typeof CONTRACT_LIMITS) => ({
    message: this.message('validation.maxLength', { max: CONTRACT_LIMITS[field] }),
  });

  protected readonly form = form(
    this.model,
    (path) => {
      const required = { message: this.message('validation.required') };
      requiredText(path.numberContract, required);
      maxLength(
        path.numberContract,
        CONTRACT_LIMITS.numberContract,
        this.maxLength('numberContract'),
      );
      requiredText(path.description, required);
      maxLength(path.description, CONTRACT_LIMITS.description, this.maxLength('description'));
      requiredText(path.address, required);
      maxLength(path.address, CONTRACT_LIMITS.address, this.maxLength('address'));
      min(path.estimatedAt, 0, { message: this.message('validation.min', { min: 0 }) });
    },
    {
      submission: {
        action: async (tree) => {
          this.submitError.set(null);
          const request = toRequest(this.model());
          const id = this.contractId();
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
          this.context.reload(); // the save succeeded, so the selector must refresh either way
          if (this.destroyed) {
            return undefined;
          }
          await this.router.navigate(['/contracts']);
          return undefined;
        },
      },
    },
  );
}
