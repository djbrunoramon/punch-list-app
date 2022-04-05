import {ResponsiblePerson} from "./responsible-person";
import {Contract} from "./contract";
import {PendencyStatus} from "./pendency-status";

export interface IPendencyDto {
  status?: PendencyStatus;
  areaIdentification?: string;
  tag?: string;
  description?: string;
  registeredBy?: number;
  registeredTo?: number;
  disapprovedBy?: number;
  finishedBy?: number;
  canceledBy?: number;
  disapprovedAt?: string;
  canceledAt?: string;
  finishedAt?: string;
  contract?: number;
  discipline?: string;
  expectedIn?: string;
  priority?: string;
}

export class PendencyDto implements IPendencyDto{
  constructor(
    public status?: PendencyStatus,
    public areaIdentification?: string,
    public tag?: string,
    public description?: string,
    public registeredBy?: number,
    public registeredTo?: number,
    public disapprovedBy?: number,
    public finishedBy?: number,
    public canceledBy?: number,
    public disapprovedAt?: string,
    public canceledAt?: string,
    public finishedAt?: string,
    public contract?: number,
    public discipline?: string,
    public expectedIn?: string,
    public priority?: string,
  ) {
  }
}
