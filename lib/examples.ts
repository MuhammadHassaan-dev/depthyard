import { aggregateBags, aggregateTons } from "./calculators/aggregate";
import { concreteBags } from "./calculators/concrete";
import { paintQuantity } from "./calculators/paint";
import { rectangleVolume } from "./calculators/volume";
import { formatQuantity } from "./format";

export function concreteFigures(input: {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  wastePercent: number;
  yieldCubicFeet: number;
}) {
  const volume = rectangleVolume({
    system: "us",
    length: input.lengthFt,
    width: input.widthFt,
    thickness: input.thicknessIn / 12,
    wastePercent: input.wastePercent,
  });
  return {
    netYards: formatQuantity(volume.netCubicYards, "yards"),
    orderYards: formatQuantity(volume.orderCubicYards, "yards"),
    bags: formatQuantity(concreteBags(volume.orderCubicFeet, input.yieldCubicFeet), "bags"),
    orderCubicFeet: volume.orderCubicFeet,
  };
}

export function bagsForYield(orderCubicFeet: number, yieldCubicFeet: number): string {
  return formatQuantity(concreteBags(orderCubicFeet, yieldCubicFeet), "bags");
}

export function gravelFigures(input: {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  wastePercent: number;
  tonsPerCubicYard: number;
}) {
  const volume = rectangleVolume({
    system: "us",
    length: input.lengthFt,
    width: input.widthFt,
    thickness: input.thicknessIn / 12,
    wastePercent: input.wastePercent,
  });
  return {
    netYards: formatQuantity(volume.netCubicYards, "yards"),
    orderYards: formatQuantity(volume.orderCubicYards, "yards"),
    tons: formatQuantity(aggregateTons(volume.orderCubicYards, input.tonsPerCubicYard), "tons"),
  };
}

export function mulchFigures(input: {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  wastePercent: number;
  bagCubicFeet: number;
}) {
  const volume = rectangleVolume({
    system: "us",
    length: input.lengthFt,
    width: input.widthFt,
    thickness: input.thicknessIn / 12,
    wastePercent: input.wastePercent,
  });
  return {
    netYards: formatQuantity(volume.netCubicYards, "yards"),
    orderYards: formatQuantity(volume.orderCubicYards, "yards"),
    bags: formatQuantity(aggregateBags(volume.orderCubicFeet, input.bagCubicFeet), "bags"),
  };
}

export function paintFigures(input: {
  lengthFt: number;
  heightFt: number;
  walls: number;
  coats: number;
  coverage: number;
  openingSqFt: number;
}) {
  const result = paintQuantity({
    length: input.lengthFt,
    height: input.heightFt,
    wallCount: input.walls,
    coats: input.coats,
    coverage: input.coverage,
    openingArea: input.openingSqFt,
  });
  return {
    area: formatQuantity(result.area, "sqft"),
    gallons: formatQuantity(result.gallons, "gallons"),
    quarts: result.quarts === null ? null : formatQuantity(result.quarts, "bags"),
  };
}
