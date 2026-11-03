import { FieldTree, TreeValidationResult, ValidationError } from '@angular/forms/signals';
import { ApiError } from '../../core/api-error/api-error';

/**
 * Maps `ApiError.fieldErrors` (from a 400 ProblemDetail) onto signal-form fields, so each message
 * is shown next to its control. Fields the form does not know are ignored (caller shows `detail`).
 */
export function toServerFieldErrors<T extends object>(
  form: FieldTree<T>,
  error: ApiError,
): TreeValidationResult {
  const errors: ValidationError.WithOptionalFieldTree[] = [];
  const fields = form as unknown as Record<string, FieldTree<unknown> | undefined>;
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    const fieldTree = fields[field];
    if (fieldTree) {
      errors.push({ kind: 'server', message, fieldTree });
    }
  }
  return errors.length ? errors : undefined;
}
