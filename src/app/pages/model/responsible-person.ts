import {Contract} from "./contract";

export interface IResponsiblePerson {
  id?: number;
  createdAt?: string;
  occupation?: string;
  department?: string;
  name?: string;
  active?: boolean;
  contract?: Contract;
}

export class ResponsiblePerson {
  constructor(
    public id?: number,
    public createdAt?: string,
    public occupation?: string,
    public department?: string,
    public name?: string,
    public active?: boolean,
    public contract?: Contract
  ) {
  }
}
