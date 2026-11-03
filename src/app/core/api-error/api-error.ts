import { HttpErrorResponse } from '@angular/common/http';

/** RFC 9457 body returned by the API (`application/problem+json`). */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: readonly { field: string; message: string }[];
}

/** Normalized error every API call fails with (thrown by `apiErrorInterceptor`). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    readonly detail: string,
    readonly fieldErrors: Readonly<Record<string, string>> = {},
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

const FALLBACK_DETAIL: Readonly<Record<number, string>> = {
  0: 'Could not reach the server. Check your connection and try again.',
  404: 'The requested record was not found.',
  502: 'The server is unavailable. Try again in a moment.',
  503: 'The server is unavailable. Try again in a moment.',
  504: 'The server is unavailable. Try again in a moment.',
};

function isProblemDetail(value: unknown): value is ProblemDetail {
  return typeof value === 'object' && value !== null && ('detail' in value || 'title' in value);
}

/** Converts anything an HTTP call can fail with into an `ApiError`. Never exposes raw bodies. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError(0, 'Unexpected error', 'Something went wrong. Please try again.');
  }

  const body: unknown = error.error;
  const problem = isProblemDetail(body) ? body : undefined;
  const fieldErrors: Record<string, string> = {};
  for (const item of problem?.errors ?? []) {
    if (typeof item?.field === 'string' && typeof item?.message === 'string') {
      fieldErrors[item.field] ??= item.message;
    }
  }

  const detail =
    (typeof problem?.detail === 'string' && problem.detail) ||
    FALLBACK_DETAIL[error.status] ||
    'Something went wrong. Please try again.';
  const title = (typeof problem?.title === 'string' && problem.title) || 'Request failed';

  return new ApiError(error.status, title, detail, fieldErrors);
}
