/**
 * The API exchanges local date-times as `yyyy-MM-ddTHH:mm`, which is exactly the value of an
 * `<input type="datetime-local">`. Empty inputs become `null` in requests.
 */
export function toApiDateTime(value: string): string | null {
  return value ? value.slice(0, 16) : null;
}

export function fromApiDateTime(value: string | null | undefined): string {
  return value ? value.slice(0, 16) : '';
}
