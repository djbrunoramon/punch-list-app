import { PendencyStatus } from '../../pendencies/data-access/pendencies.models';

/** One slice of `GET /pendency/contract/{id}/chart/pie` (the API always returns the 4 statuses). */
export interface StatusCount {
  label: PendencyStatus;
  quantity: number;
}

/** One bar of `GET /pendency/contract/{id}/chart/bar/{status}`. */
export interface PriorityCount {
  priority: string;
  quantity: number;
}
