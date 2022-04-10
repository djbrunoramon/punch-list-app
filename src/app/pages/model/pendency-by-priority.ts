export interface IPendencyByPriority {
  priority: string;
  quantity: number;
}

export class PendencyByPriority implements IPendencyByPriority {
  constructor(public quantity: number, public priority: string) {
  }
}
