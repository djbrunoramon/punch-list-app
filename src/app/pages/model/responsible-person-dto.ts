export interface IResponsiblePersonDto {
  idContract?: number;
  name?: string;
  occupation?: string;
  department?: string;
}

export class ResponsiblePersonDto implements IResponsiblePersonDto{
  constructor(
    public idContract?: number,
    public name?: string,
    public occupation?: string,
    public department?: string
  ) {
  }
}
