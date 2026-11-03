import { Injectable, computed, effect, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ContractsApi } from '../../features/contracts/data-access/contracts.api';
import { Contract } from '../../features/contracts/data-access/contracts.models';

export const SELECTED_CONTRACT_KEY = 'punch-list.selected-contract';

function readStoredId(): number | null {
  try {
    const value = Number(localStorage.getItem(SELECTED_CONTRACT_KEY));
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

/**
 * The contract the user is working on (EXT-02). Dashboard, responsible persons and pendencies
 * read `selectedId()`; the shell selector writes `selected`. The choice survives reloads.
 */
@Injectable({ providedIn: 'root' })
export class ContractContext {
  private readonly api = inject(ContractsApi);

  /** All contracts (GET /api/v1/contract). */
  readonly contracts = rxResource({ stream: () => this.api.list() });

  /** Why the contracts could not be loaded (undefined while loading or loaded). */
  readonly error = computed(() => this.contracts.error());

  private readonly list = computed(() => (this.contracts.hasValue() ? this.contracts.value() : []));

  /** Writable: falls back to the stored id, then to the first contract, when the list changes. */
  readonly selected = linkedSignal<Contract[], Contract | null>({
    source: this.list,
    computation: (contracts, previous) => {
      const wantedId = previous?.value?.id ?? readStoredId();
      return contracts.find((c) => c.id === wantedId) ?? contracts[0] ?? null;
    },
  });

  readonly selectedId = computed(() => this.selected()?.id ?? null);

  constructor() {
    effect(() => {
      const id = this.selectedId();
      if (id !== null) {
        try {
          localStorage.setItem(SELECTED_CONTRACT_KEY, String(id));
        } catch {
          // storage unavailable (private mode): selection just won't persist
        }
      }
    });
  }

  select(id: number): void {
    const contract = this.list().find((c) => c.id === id);
    if (contract) {
      this.selected.set(contract);
    }
  }

  /** Call after creating/updating a contract so the selector shows fresh data. */
  reload(): void {
    this.contracts.reload();
  }
}
