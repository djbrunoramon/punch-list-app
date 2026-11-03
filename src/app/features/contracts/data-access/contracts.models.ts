/** `ContractResponse` of the API (contract v1). Dates are local `yyyy-MM-ddTHH:mm`. */
export interface Contract {
  id: number;
  numberContract: string;
  description: string;
  address: string;
  startAt: string | null;
  scheduledTo: string | null;
  active: boolean;
  inactiveAt: string | null;
  estimatedAt: number | null;
}

/** `ContractRequest` of the API. */
export interface ContractRequest {
  numberContract: string;
  description: string;
  address: string;
  startAt: string | null;
  scheduledTo: string | null;
  estimatedAt: number | null;
}

/** Same limits as the API (`@Size` = column length) — AM-07. */
export const CONTRACT_LIMITS = {
  numberContract: 50,
  description: 500,
  address: 255,
} as const;
