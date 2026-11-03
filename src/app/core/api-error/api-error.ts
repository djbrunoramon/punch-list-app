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

/** Translates an i18n key (see `docs/i18n.md`); the identity is used where no translator is available. */
export type Translate = (key: string) => string;

/** Fallback detail keys when the response is not a problem detail (network, proxy errors...). */
const FALLBACK_DETAIL_KEY: Readonly<Record<number, string>> = {
  0: 'error.network',
  404: 'error.notFound',
  502: 'error.serverUnavailable',
  503: 'error.serverUnavailable',
  504: 'error.serverUnavailable',
};

function isProblemDetail(value: unknown): value is ProblemDetail {
  return typeof value === 'object' && value !== null && ('detail' in value || 'title' in value);
}

function isFieldError(value: unknown): value is { field: string; message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>)['field'] === 'string' &&
    typeof (value as Record<string, unknown>)['message'] === 'string'
  );
}

/**
 * Converts anything an HTTP call can fail with into an `ApiError`. Never exposes raw bodies. Texts sent by
 * the API (already in the request language) are kept; fallbacks are translated with `translate`.
 */
export function toApiError(error: unknown, translate: Translate = (key) => key): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError(0, translate('error.title.unexpected'), translate('error.unexpected'));
  }

  const body: unknown = error.error;
  const problem = isProblemDetail(body) ? body : undefined;
  const fieldErrors: Record<string, string> = {};
  const items: readonly unknown[] = Array.isArray(problem?.errors) ? problem.errors : [];
  for (const item of items) {
    if (isFieldError(item)) {
      fieldErrors[item.field] ??= item.message;
    }
  }

  const fallbackKey = FALLBACK_DETAIL_KEY[error.status];
  const detail =
    (typeof problem?.detail === 'string' && problem.detail) ||
    translate(fallbackKey ?? 'error.unexpected');
  const title =
    (typeof problem?.title === 'string' && problem.title) || translate('error.title.requestFailed');

  return new ApiError(error.status, title, detail, fieldErrors);
}
