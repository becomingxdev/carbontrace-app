/**
 * Shared numeric input handler factory for calculator step components.
 *
 * Centralises the parse-and-clamp logic that was previously duplicated
 * across all five wizard steps, ensuring a single point of change.
 */
export function parseNumericInput(value: string): number {
  return Math.max(0, parseFloat(value) || 0);
}

/**
 * Returns an onChange handler for a specific field within a step's data object.
 * Keeps step components free of low-level string-to-number conversion details.
 */
export function createFieldChangeHandler<T extends Record<string, number>>(
  field: keyof T,
  data: T,
  onChange: (updated: T) => void
): (value: string) => void {
  return (value: string) => {
    onChange({ ...data, [field]: parseNumericInput(value) });
  };
}
