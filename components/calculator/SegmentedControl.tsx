import type { UnitSystem } from "@/lib/calculators/units";

export function SegmentedControl({
  value,
  onChange,
}: {
  value: UnitSystem;
  onChange: (value: UnitSystem) => void;
}) {
  const options: { id: UnitSystem; label: string }[] = [
    { id: "us", label: "US" },
    { id: "metric", label: "Metric" },
  ];

  return (
    <div role="group" aria-label="Units" className="grid grid-cols-2 gap-2 sm:max-w-xs">
      {options.map((option) => {
        const pressed = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.id)}
            className={
              pressed
                ? "h-12 rounded-xl bg-ink text-base font-semibold text-paper"
                : "h-12 rounded-xl border border-line bg-paper text-base font-semibold text-ink"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
