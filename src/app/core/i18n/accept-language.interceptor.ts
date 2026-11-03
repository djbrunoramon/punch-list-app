import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Language } from './language';

/** Sends the current UI language so the API answers problem details in the same language. */
export const acceptLanguageInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'Accept-Language': inject(Language).current() } }));
