import { Contract } from '../../contracts/data-access/contracts.models';

export const PENDENCY_STATUSES = ['OPEN', 'CLOSED', 'DISAPPROVED', 'CANCELED'] as const;
export type PendencyStatus = (typeof PENDENCY_STATUSES)[number];

/** Responsible person as nested in a `PendencyResponse` (no `contract`, to avoid nesting). */
export interface PersonSummary {
  id: number;
  name: string;
  occupation: string;
  department: string;
  createdAt: string;
  active: boolean;
}

/** `PendencyResponse` of the API (contract v1). Dates are local `yyyy-MM-ddTHH:mm`. */
export interface Pendency {
  id: number;
  areaIdentification: string;
  tag: string | null;
  description: string;
  priority: string;
  discipline: string;
  status: PendencyStatus;
  createdAt: string;
  modifiedIn: string | null;
  expectedIn: string | null;
  finishedAt: string | null;
  disapprovedAt: string | null;
  canceledAt: string | null;
  contract: Contract;
  registeredBy: PersonSummary;
  registeredTo: PersonSummary;
  finishedBy: PersonSummary | null;
  disapprovedBy: PersonSummary | null;
  canceledBy: PersonSummary | null;
}

/** `PendencyRequest` of the API. Responsible persons are sent by id. */
export interface PendencyRequest {
  idContract: number;
  areaIdentification: string;
  tag: string | null;
  description: string;
  priority: string;
  status: PendencyStatus;
  discipline: string;
  registeredBy: number;
  registeredTo: number;
  expectedIn: string | null;
  finishedBy: number | null;
  finishedAt: string | null;
  disapprovedBy: number | null;
  disapprovedAt: string | null;
  canceledBy: number | null;
  canceledAt: string | null;
}

/** Same limits as the API (`@Size` = column length) — AM-07. */
export const PENDENCY_LIMITS = {
  areaIdentification: 120,
  tag: 50,
  description: 2000,
  priority: 20,
  discipline: 60,
} as const;
