export interface IContract {
  id?: number;
  numberContract?:	string;
  startAt?: string;
  scheduledTo?:	string;
  inactiveAt?:	string;
  estimatedAt?:	number;
  description?:	string;
  address?:	string;
  active?: boolean;
}

export class Contract implements IContract {
  constructor(
    public id?: number,
    public numberContract?:	string,
    public startAt?: string,
    public scheduledTo?:	string,
    public inactiveAt?:	string,
    public estimatedAt?:	number,
    public description?:	string,
    public address?:	string,
    public active?: boolean,
  ) {
  }
}
