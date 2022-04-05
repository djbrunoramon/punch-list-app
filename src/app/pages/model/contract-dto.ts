export interface IContractDto {
  numberContract?: string;
  description?:	string;
  address?: string;
  startAt?: string;
  scheduledTo?: string;
  estimatedAt?: number;
}

export class ContractDto implements IContractDto {
  constructor(
    public numberContract?: string,
    public description?:	string,
    public address?: string,
    public startAt?: string,
    public scheduledTo?: string,
    public estimatedAt?: number
  ) {
  }
}
