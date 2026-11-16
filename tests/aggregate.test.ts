import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { aggregateBags, aggregateTons } from "../lib/calculators/aggregate";
import { rectangleVolume } from "../lib/calculators/volume";

describe("aggregate", () => {
  it("multiplies order yards by the density the caller passed", () => {
    const volume = rectangleVolume({
      system: "us",
      length: 10,
      width: 20,
      thickness: 3 / 12,
      wastePercent: 10,
    });
    assert.equal(aggregateTons(volume.orderCubicYards, 1.4), volume.orderCubicYards * 1.4);
    assert.equal(aggregateTons(2, 1.4), 2.8);
  });

  it("rounds a 0.1 bag remainder up to one more bag", () => {
    assert.equal(aggregateBags(2.2, 2), 2);
    assert.equal(aggregateBags(2, 2), 1);
  });
});
