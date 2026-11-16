import type { UnitSystem } from "@/lib/calculators/units";
import { NumberField } from "./NumberField";

export function DimensionField({
  idPrefix,
  legend,
  system,
  primary,
  remainder,
  onPrimary,
  onRemainder,
  error,
}: {
  idPrefix: string;
  legend: string;
  system: UnitSystem;
  primary: string;
  remainder: string;
  onPrimary: (value: string) => void;
  onRemainder: (value: string) => void;
  error?: string;
}) {
  const errorId = error ? `${idPrefix}-error` : undefined;
  const primaryUnit = system === "us" ? "Feet" : "Meters";
  const remainderUnit = system === "us" ? "Inches" : "Centimeters";

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-ink">{legend}</legend>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id={`${idPrefix}-primary`}
          label={primaryUnit}
          value={primary}
          onChange={onPrimary}
          describedBy={errorId}
          invalid={Boolean(error)}
        />
        <NumberField
          id={`${idPrefix}-remainder`}
          label={remainderUnit}
          value={remainder}
          onChange={onRemainder}
          describedBy={errorId}
          invalid={Boolean(error)}
          hint={system === "us" ? "Blank means zero. 14 stays 14." : "Blank means zero."}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm leading-5 text-accent">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
