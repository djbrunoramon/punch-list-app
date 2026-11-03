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
import { FormField, FormRoot, form, maxLength, min, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TuiButton, TuiError, TuiInput, TuiNotification } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { firstValueFrom } from 'rxjs';
import { toApiError } from '../../../core/api-error/api-error';
import { ContractContext } from '../../../core/contract-context/contract-context';
import { fromApiDateTime, toApiDateTime } from '../../../shared/util/date-time';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contract-form.page.html',
})
export class ContractFormPage {
  private readonly api = inject(ContractsApi);
  private readonly context = inject(ContractContext);
  private readonly router = inject(Router);

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

  protected readonly form = form(
    this.model,
    (path) => {
      required(path.numberContract, { message: 'Contract number is required' });
      maxLength(path.numberContract, CONTRACT_LIMITS.numberContract);
      required(path.description, { message: 'Description is required' });
      maxLength(path.description, CONTRACT_LIMITS.description);
      required(path.address, { message: 'Address is required' });
      maxLength(path.address, CONTRACT_LIMITS.address);
      min(path.estimatedAt, 0, { message: 'Must be zero or more' });
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
            const apiError = toApiError(error);
            this.submitError.set(apiError.detail);
            return toServerFieldErrors(tree, apiError);
          }
          this.context.reload();
          await this.router.navigate(['/contracts']);
          return undefined;
        },
      },
    },
  );
}
