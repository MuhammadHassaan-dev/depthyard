import { roundUpCount } from "./round";

export function aggregateTons(orderCubicYards: number, tonsPerCubicYard: number): number {
  return orderCubicYards * tonsPerCubicYard;
}

export function aggregateBags(orderCubicFeet: number, bagCubicFeet: number): number {
  return roundUpCount(orderCubicFeet / bagCubicFeet);
}
