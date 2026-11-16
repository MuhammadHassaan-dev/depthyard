export type QuantityKind =
  | "yards"
  | "tons"
  | "meters"
  | "gallons"
  | "liters"
  | "bags"
  | "sqft"
  | "sqm";

const DECIMALS: Record<QuantityKind, number | "whole"> = {
  yards: 2,
  tons: 2,
  meters: 2,
  gallons: 1,
  liters: 1,
  bags: "whole",
  sqft: "whole",
  sqm: "whole",
};

export function formatQuantity(value: number, kind: QuantityKind): string {
  if (!Number.isFinite(value)) return "";
  const digits = DECIMALS[kind];
  if (digits === "whole") return String(Math.round(value));
  return value.toFixed(digits);
}

export function formatDefault(value: number): string {
  if (!Number.isFinite(value)) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
