import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Origin prepended to every API call (empty string = same origin / dev proxy). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
