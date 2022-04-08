export interface IPendencyByStatus {
  label: string;
  quantity: number;
}

export class PendencyByStatus implements IPendencyByStatus {
  constructor(public label: string, public quantity: number) {
  }
}
