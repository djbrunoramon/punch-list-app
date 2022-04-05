import {ResponsiblePerson} from "./responsible-person";
import {Contract} from "./contract";
import {PendencyStatus} from "./pendency-status";

export interface IPendency {
  id?: number;
  status?: PendencyStatus;
  areaIdentification?: string;
  tag?: string;
  description?: string;
  registeredBy?: ResponsiblePerson;
  registeredTo?: ResponsiblePerson;
  disapprovedBy?: ResponsiblePerson;
  finishedBy?: ResponsiblePerson;
  canceledBy?: ResponsiblePerson;
  disapprovedAt?: string;
  canceledAt?: string;
  finishedAt?: string;
  createdAt?: string;
  contract?: Contract;
  discipline?: string;
  expectedIn?: string;
  priority?: string;
}

export class Pendency implements IPendency{
  constructor(
    public id?: number,
    public status?: PendencyStatus,
    public areaIdentification?: string,
    public tag?: string,
    public description?: string,
    public registeredBy?: ResponsiblePerson,
    public registeredTo?: ResponsiblePerson,
    public disapprovedBy?: ResponsiblePerson,
    public finishedBy?: ResponsiblePerson,
    public canceledBy?: ResponsiblePerson,
    public disapprovedAt?: string,
    public canceledAt?: string,
    public finishedAt?: string,
    public createdAt?: string,
    public contract?: Contract,
    public discipline?: string,
    public expectedIn?: string,
    public priority?: string,
  ) {
  }
}
