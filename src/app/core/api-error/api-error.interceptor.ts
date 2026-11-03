import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, throwError } from 'rxjs';
import { toApiError } from './api-error';

/** Turns every failed HTTP call into an `ApiError` (ProblemDetail aware, fallbacks translated). */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const transloco = inject(TranslocoService);
  return next(req).pipe(
    catchError((error: unknown) =>
      throwError(() => toApiError(error, (key) => transloco.translate(key))),
    ),
  );
};
