import {
  SchemaPath,
  SchemaPathRules,
  required,
  requiredError,
  validate,
} from '@angular/forms/signals';

/**
 * `required` for text fields that the API validates with `@NotBlank`: besides the empty string,
 * a value with only whitespace is also rejected (the request mapping trims it to empty).
 * Keeps the `required` metadata of the field and reports a single `required` error.
 */
export function requiredText(
  path: SchemaPath<string, SchemaPathRules.Supported>,
  config: { message: string },
): void {
  required(path, config);
  validate(path, ({ value }) => {
    const text = value();
    return text !== '' && text.trim() === '' ? requiredError(config) : undefined;
  });
}
