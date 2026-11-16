import { roundUpCount } from "./round";

/** Whole bags to buy. A partial bag rounds up. Yards are not rounded before this division. */
export function concreteBags(orderCubicFeet: number, yieldCubicFeet: number): number {
  return roundUpCount(orderCubicFeet / yieldCubicFeet);
}
