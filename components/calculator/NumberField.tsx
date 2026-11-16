export const controlClass =
  "h-12 w-full min-w-0 rounded-xl border border-line bg-paper px-3 text-base text-ink tabular-nums outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30";

export function NumberField({
  id,
  label,
  value,
  onChange,
  suffix,
  hint,
  error,
  invalid,
  describedBy,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const described = [describedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error || invalid ? true : undefined}
          aria-describedby={described}
          className={`${controlClass} ${suffix ? "pr-16" : ""}`}
        />
        {suffix ? (
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-sm leading-5 text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm leading-5 text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
