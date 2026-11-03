import { Contract } from '../../contracts/data-access/contracts.models';

/** `ResponsiblePersonResponse` of the API (contract v1). */
export interface ResponsiblePerson {
  id: number;
  name: string;
  occupation: string;
  department: string;
  createdAt: string;
  active: boolean;
  contract: Contract;
}

/** `ResponsiblePersonRequest` of the API. */
export interface ResponsiblePersonRequest {
  idContract: number;
  name: string;
  occupation: string;
  department: string;
}

/** Same limits as the API (`@Size` = column length) — AM-07. */
export const RESPONSIBLE_PERSON_LIMITS = {
  name: 120,
  occupation: 120,
  department: 120,
} as const;
