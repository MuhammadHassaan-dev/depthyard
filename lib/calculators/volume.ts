import { readNumber } from "../readNumber";
import {
  centimetersToMeters,
  inchesToFeet,
  lengthToBase,
  type UnitSystem,
} from "./units";

const CUBIC_FEET_PER_CUBIC_METER = 1 / 0.3048 ** 3;

export type Issue = { field: string; message: string };

export type RectangleInput = {
  system: UnitSystem;
  length: number;
  width: number;
  thickness: number;
  wastePercent: number;
};

export type VolumeResult = {
  system: UnitSystem;
  netCubicFeet: number;
  orderCubicFeet: number;
  netCubicYards: number;
  orderCubicYards: number;
  netCubicMeters: number;
  orderCubicMeters: number;
};

export type VolumeRaw = {
  system: UnitSystem;
  lengthPrimary: string;
  lengthRemainder: string;
  widthPrimary: string;
  widthRemainder: string;
  thickness: string;
  waste: string;
};

function applyWaste(net: number, wastePercent: number): number {
  return net * (1 + wastePercent / 100);
}

/**
 * Rectangle volume. Inputs are already in the base unit for the system:
 * feet for a US job, meters for a metric job. Nothing is rounded here.
 */
export function rectangleVolume(input: RectangleInput): VolumeResult {
  if (input.system === "us") {
    const netCubicFeet = input.length * input.width * input.thickness;
    const orderCubicFeet = applyWaste(netCubicFeet, input.wastePercent);
    return {
      system: "us",
      netCubicFeet,
      orderCubicFeet,
      netCubicYards: netCubicFeet / 27,
      orderCubicYards: orderCubicFeet / 27,
      netCubicMeters: netCubicFeet / CUBIC_FEET_PER_CUBIC_METER,
      orderCubicMeters: orderCubicFeet / CUBIC_FEET_PER_CUBIC_METER,
    };
  }

  const netCubicMeters = input.length * input.width * input.thickness;
  const orderCubicMeters = applyWaste(netCubicMeters, input.wastePercent);
  const netCubicFeet = netCubicMeters * CUBIC_FEET_PER_CUBIC_METER;
  const orderCubicFeet = orderCubicMeters * CUBIC_FEET_PER_CUBIC_METER;
  return {
    system: "metric",
    netCubicFeet,
    orderCubicFeet,
    netCubicYards: netCubicFeet / 27,
    orderCubicYards: orderCubicFeet / 27,
    netCubicMeters,
    orderCubicMeters,
  };
}

function readDimension(
  primary: string,
  remainder: string,
  system: UnitSystem,
  label: string,
): { ok: true; value: number } | { ok: false; error: string } {
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

  return { ok: true, value: base };
}

export function volumeValues(
  raw: VolumeRaw,
):
  | { ok: true; length: number; width: number; thickness: number; wastePercent: number }
  | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];

  const length = readDimension(raw.lengthPrimary, raw.lengthRemainder, raw.system, "length");
  const width = readDimension(raw.widthPrimary, raw.widthRemainder, raw.system, "width");
  const thicknessRead = readNumber(raw.thickness, { label: "thickness", allowZero: false });
  const wasteRead = readNumber(raw.waste, {
    label: "waste",
    allowZero: true,
    max: 100,
    maxLabel: "100%",
  });

  if (!length.ok) issues.push({ field: "length", message: length.error });
  if (!width.ok) issues.push({ field: "width", message: width.error });
  if (!thicknessRead.ok) issues.push({ field: "thickness", message: thicknessRead.error });
  if (!wasteRead.ok) issues.push({ field: "waste", message: wasteRead.error });

  if (!length.ok || !width.ok || !thicknessRead.ok || !wasteRead.ok) {
    return { ok: false, issues };
  }

  const thickness =
    raw.system === "us"
      ? inchesToFeet(thicknessRead.value)
      : centimetersToMeters(thicknessRead.value);

  return {
    ok: true,
    length: length.value,
    width: width.value,
    thickness,
    wastePercent: wasteRead.value,
  };
}

/**
 * Parses the form first. Geometry runs only after every required dimension is valid,
 * so a zero thickness never reaches the volume function.
 */
export function rectangleFromRaw(
  raw: VolumeRaw,
  geometry: typeof rectangleVolume = rectangleVolume,
):
  | {
      ok: true;
      length: number;
      width: number;
      thickness: number;
      wastePercent: number;
      volume: VolumeResult;
    }
  | { ok: false; issues: Issue[] } {
  const parsed = volumeValues(raw);
  if (!parsed.ok) return parsed;

  const volume = geometry({
    system: raw.system,
    length: parsed.length,
    width: parsed.width,
    thickness: parsed.thickness,
    wastePercent: parsed.wastePercent,
  });

  if (!Number.isFinite(volume.orderCubicYards) || !Number.isFinite(volume.orderCubicFeet)) {
    return {
      ok: false,
      issues: [{ field: "length", message: "That size is too large to calculate." }],
    };
  }

  return { ...parsed, volume };
}
