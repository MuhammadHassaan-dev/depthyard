/** Round up to a whole count, treating a float that landed on an integer as that integer. */
export function roundUpCount(value: number): number {
  const nearest = Math.round(value);
  if (Math.abs(value - nearest) <= 1e-8) return nearest;
  return Math.ceil(value);
}
