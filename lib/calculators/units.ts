export type UnitSystem = "us" | "metric";

export const METERS_PER_FOOT = 0.3048;
export const FEET_PER_METER = 1 / METERS_PER_FOOT;
export const CENTIMETERS_PER_INCH = 2.54;
export const LITERS_PER_GALLON = 3.785411784;
export const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;

export function feetAndInchesToFeet(feet: number, inches: number): number {
  return feet + inches / 12;
}

export function metersAndCentimetersToMeters(meters: number, centimeters: number): number {
  return meters + centimeters / 100;
}

export function lengthToBase(primary: number, remainder: number, system: UnitSystem): number {
  return system === "us"
    ? feetAndInchesToFeet(primary, remainder)
    : metersAndCentimetersToMeters(primary, remainder);
}

export function inchesToFeet(inches: number): number {
  return inches / 12;
}

export function centimetersToMeters(centimeters: number): number {
  return centimeters / 100;
}

export function feetToMeters(feet: number): number {
  return feet * METERS_PER_FOOT;
}

export function metersToFeet(meters: number): number {
  return meters * FEET_PER_METER;
}

export function sqFtPerGallonToSqMPerLiter(sqFtPerGallon: number): number {
  return (sqFtPerGallon * SQUARE_METERS_PER_SQUARE_FOOT) / LITERS_PER_GALLON;
}

export function sqMPerLiterToSqFtPerGallon(sqMPerLiter: number): number {
  return (sqMPerLiter * LITERS_PER_GALLON) / SQUARE_METERS_PER_SQUARE_FOOT;
}

export function squareFeetToSquareMeters(squareFeet: number): number {
  return squareFeet * SQUARE_METERS_PER_SQUARE_FOOT;
}

export function squareMetersToSquareFeet(squareMeters: number): number {
  return squareMeters / SQUARE_METERS_PER_SQUARE_FOOT;
}

export function formatConverted(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return "";
  const factor = 10 ** maxDecimals;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return String(rounded);
}

export function convertLengthParts(
  primary: number,
  remainder: number,
  from: UnitSystem,
  to: UnitSystem,
): { primary: string; remainder: string } {
  if (from === to) {
    return { primary: formatConverted(primary), remainder: formatConverted(remainder) };
  }

  if (from === "us") {
    const meters = feetToMeters(feetAndInchesToFeet(primary, remainder));
    const whole = Math.floor(meters + 1e-9);
    const centimeters = (meters - whole) * 100;
    return { primary: String(whole), remainder: formatConverted(centimeters) };
  }

  const feet = metersToFeet(metersAndCentimetersToMeters(primary, remainder));
  const whole = Math.floor(feet + 1e-9);
  const inches = (feet - whole) * 12;
  return { primary: String(whole), remainder: formatConverted(inches) };
}

export function convertThickness(value: number, from: UnitSystem, to: UnitSystem): string {
  if (from === to) return formatConverted(value);
  if (from === "us") return formatConverted(value * CENTIMETERS_PER_INCH);
  return formatConverted(value / CENTIMETERS_PER_INCH);
}

export function convertCoverage(value: number, from: UnitSystem, to: UnitSystem): string {
  if (from === to) return formatConverted(value);
  const converted =
    from === "us" ? sqFtPerGallonToSqMPerLiter(value) : sqMPerLiterToSqFtPerGallon(value);
  return formatConverted(converted);
}

export function convertArea(value: number, from: UnitSystem, to: UnitSystem): string {
  if (from === to) return formatConverted(value);
  const converted = from === "us" ? squareFeetToSquareMeters(value) : squareMetersToSquareFeet(value);
  return formatConverted(converted);
}
