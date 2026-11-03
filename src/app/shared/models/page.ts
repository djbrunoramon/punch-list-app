import { HttpParams } from '@angular/common/http';

/** Paged body returned by the API (Spring Data `VIA_DTO` serialization). */
export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** Zero-based page request. `sort` follows Spring syntax: `field,asc|desc`. */
export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
}

/** API caps `size` at 100 (AM-06). */
export const MAX_PAGE_SIZE = 100;

export function toPageParams({ page, size, sort }: PageRequest): HttpParams {
  let params = new HttpParams()
    .set('page', Math.max(0, page))
    .set('size', Math.min(Math.max(1, size), MAX_PAGE_SIZE));
  if (sort) {
    params = params.set('sort', sort);
  }
  return params;
}
