export type NumberRead =
  | { ok: true; value: number }
  | { ok: false; error: string };

const NUMBER_PATTERN = /^(?:\d+\.?\d*|\.\d+)$/;

function capitalize(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Accepts a decimal string. Empty and negative values are errors.
 * Zero is an error unless allowZero is set. The result is a value, never a throw.
 */
export function readNumber(
  raw: string,
  options: {
    label: string;
    allowZero?: boolean;
    max?: number;
    maxLabel?: string;
  },
): NumberRead {
  const text = raw.trim();
  const label = options.label;

  if (text === "") {
    return { ok: false, error: `Enter a ${label}.` };
  }

  if (text.startsWith("-")) {
    return { ok: false, error: `${capitalize(label)} cannot be negative.` };
  }

  if (!NUMBER_PATTERN.test(text)) {
    return { ok: false, error: `Enter a number for ${label}.` };
  }

  const value = Number(text);
  if (!Number.isFinite(value)) {
    return { ok: false, error: `Enter a number for ${label}.` };
  }

  if (value === 0 && !options.allowZero) {
    return { ok: false, error: `${capitalize(label)} must be greater than zero.` };
  }

  if (options.max !== undefined && value > options.max) {
    return {
      ok: false,
      error: `${capitalize(label)} cannot be more than ${options.maxLabel ?? String(options.max)}.`,
    };
  }

  return { ok: true, value };
}
