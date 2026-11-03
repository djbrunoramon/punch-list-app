import { Contract } from '../app/features/contracts/data-access/contracts.models';

/** Test-only data (excluded from the app build in tsconfig.app.json). */
export function aContract(overrides: Partial<Contract> = {}): Contract {
  return {
    id: 1,
    numberContract: 'BR2022-001',
    description: 'Thermoelectric Power Plant Generation Brazil',
    address: 'Manaus-AM-BR',
    startAt: '2026-11-04T10:00',
    scheduledTo: null,
    active: true,
    inactiveAt: null,
    estimatedAt: 1500.5,
    ...overrides,
  };
}
