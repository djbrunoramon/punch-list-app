import { Contract } from '../app/features/contracts/data-access/contracts.models';
import { Pendency, PersonSummary } from '../app/features/pendencies/data-access/pendencies.models';
import { ResponsiblePerson } from '../app/features/responsible-persons/data-access/responsible-persons.models';
import { Page } from '../app/shared/models/page';

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

export function aResponsiblePerson(overrides: Partial<ResponsiblePerson> = {}): ResponsiblePerson {
  return {
    id: 1,
    name: 'Maria Souza',
    occupation: 'Engineer',
    department: 'Civil',
    createdAt: '2026-11-04T10:00',
    active: true,
    contract: aContract(),
    ...overrides,
  };
}

export function aPersonSummary(overrides: Partial<PersonSummary> = {}): PersonSummary {
  return {
    id: 1,
    name: 'Maria Souza',
    occupation: 'Engineer',
    department: 'Civil',
    createdAt: '2026-11-04T10:00',
    active: true,
    ...overrides,
  };
}

export function aPendency(overrides: Partial<Pendency> = {}): Pendency {
  return {
    id: 1,
    areaIdentification: 'Area 51',
    tag: 'TAG-001',
    description: 'Fix the cable tray',
    priority: 'HIGH',
    discipline: 'Electrical',
    status: 'OPEN',
    createdAt: '2026-11-04T10:00',
    modifiedIn: null,
    expectedIn: null,
    finishedAt: null,
    disapprovedAt: null,
    canceledAt: null,
    contract: aContract(),
    registeredBy: aPersonSummary(),
    registeredTo: aPersonSummary({ id: 2, name: 'João Lima' }),
    finishedBy: null,
    disapprovedBy: null,
    canceledBy: null,
    ...overrides,
  };
}

/** Builds the API page envelope (Spring Data `VIA_DTO`). */
export function aPage<T>(content: T[], page: Partial<Page<T>['page']> = {}): Page<T> {
  return {
    content,
    page: {
      size: 10,
      number: 0,
      totalElements: content.length,
      totalPages: content.length ? 1 : 0,
      ...page,
    },
  };
}
