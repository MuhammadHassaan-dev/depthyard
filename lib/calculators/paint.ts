import { readNumber, type NumberRead } from "../readNumber";
import type { Issue } from "./volume";
import { roundUpCount } from "./round";
import {
  lengthToBase,
  metersToFeet,
  squareMetersToSquareFeet,
  sqMPerLiterToSqFtPerGallon,
  type UnitSystem,
} from "./units";

export type PaintInput = {
  length: number;
  height: number;
  wallCount: number;
  coats: number;
  coverage: number;
  openingArea: number;
};

export type PaintResult = {
  area: number;
  gallons: number;
  quarts: number | null;
};

export type PaintRaw = {
  system: UnitSystem;
  lengthPrimary: string;
  lengthRemainder: string;
  heightPrimary: string;
  heightRemainder: string;
  walls: string;
  coats: string;
  coverage: string;
  opening: string;
};

/** Area is square feet after one subtraction of the openings. Gallons are not rounded here. */
export function paintQuantity(input: PaintInput): PaintResult {
  const area = input.length * input.height * input.wallCount - input.openingArea;
  const gallons = (area * input.coats) / input.coverage;
  const quarts = gallons < 1 ? roundUpCount(gallons * 4) : null;
  return { area, gallons, quarts };
}

function readDimension(
  primary: string,
  remainder: string,
  system: UnitSystem,
  label: string,
): NumberRead {
  if (primary.trim() === "" && remainder.trim() === "") {
    return { ok: false, error: `Enter a ${label}.` };
  }

  const primaryRead = readNumber(primary.trim() === "" ? "0" : primary, {
    label,
    allowZero: true,
  });
  if (!primaryRead.ok) return primaryRead;

  const remainderLabel = system === "us" ? "inches" : "centimeters";
  const remainderRead = readNumber(remainder.trim() === "" ? "0" : remainder, {
    label: remainderLabel,
    allowZero: true,
  });
  if (!remainderRead.ok) return remainderRead;

  const base = lengthToBase(primaryRead.value, remainderRead.value, system);
  if (!(base > 0)) {
    const name = label.charAt(0).toUpperCase() + label.slice(1);
    return { ok: false, error: `${name} must be greater than zero.` };
  }

  return { ok: true, value: system === "us" ? base : metersToFeet(base) };
}

export function paintFromRaw(
  raw: PaintRaw,
  compute: typeof paintQuantity = paintQuantity,
): { ok: true; result: PaintResult } | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];
  const length = readDimension(raw.lengthPrimary, raw.lengthRemainder, raw.system, "wall length");
  const height = readDimension(raw.heightPrimary, raw.heightRemainder, raw.system, "wall height");
  const walls = readNumber(raw.walls, { label: "number of walls", allowZero: false });
  const coats = readNumber(raw.coats, { label: "coats", allowZero: false });
  const coverage = readNumber(raw.coverage, { label: "coverage", allowZero: false });
  const openingBlank = raw.opening.trim() === "";
  const opening = readNumber(openingBlank ? "0" : raw.opening, {
    label: "opening area",
    allowZero: true,
  });

  if (!length.ok) issues.push({ field: "length", message: length.error });
  if (!height.ok) issues.push({ field: "height", message: height.error });
  if (!walls.ok) issues.push({ field: "walls", message: walls.error });
  if (!coats.ok) issues.push({ field: "coats", message: coats.error });
  if (!coverage.ok) issues.push({ field: "coverage", message: coverage.error });
  if (!opening.ok) issues.push({ field: "opening", message: opening.error });

  if (!length.ok || !height.ok || !walls.ok || !coats.ok || !coverage.ok || !opening.ok) {
    return { ok: false, issues };
  }

  const coveragePerGallon =
    raw.system === "us" ? coverage.value : sqMPerLiterToSqFtPerGallon(coverage.value);
  const openingSqFt =
    raw.system === "us" ? opening.value : squareMetersToSquareFeet(opening.value);
  const gross = length.value * height.value * walls.value;

  if (openingSqFt > gross) {
    return {
      ok: false,
      issues: [
        ...issues,
        { field: "opening", message: "Openings are larger than the wall area." },
      ],
    };
  }

  return {
    ok: true,
    result: compute({
      length: length.value,
      height: height.value,
      wallCount: walls.value,
      coats: coats.value,
      coverage: coveragePerGallon,
      openingArea: openingSqFt,
    }),
  };
}
