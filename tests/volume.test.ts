import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { rectangleFromRaw, rectangleVolume } from "../lib/calculators/volume";
import { convertLengthParts, feetAndInchesToFeet, inchesToFeet } from "../lib/calculators/units";
import { formatQuantity } from "../lib/format";

const slab = {
  system: "us" as const,
  lengthPrimary: "10",
  lengthRemainder: "",
  widthPrimary: "10",
  widthRemainder: "",
  thickness: "4",
  waste: "10",
};

describe("rectangle volume", () => {
  it("counts a 10 by 10 ft slab at 4 in as 1.23 cubic yards net", () => {
    const parsed = rectangleFromRaw(slab);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(formatQuantity(parsed.volume.netCubicYards, "yards"), "1.23");
  });

  it("adds 10% waste after the net volume, to 1.36 cubic yards", () => {
    const parsed = rectangleFromRaw(slab);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(formatQuantity(parsed.volume.orderCubicYards, "yards"), "1.36");
  });

  it("does not add a phantom yard at 0% waste", () => {
    const parsed = rectangleFromRaw({ ...slab, waste: "0" });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.volume.orderCubicYards, parsed.volume.netCubicYards);
    assert.equal(formatQuantity(parsed.volume.orderCubicYards, "yards"), "1.23");
    assert.equal(formatQuantity(parsed.volume.netCubicYards, "yards"), "1.23");
  });

  it("rejects a zero thickness before geometry runs", () => {
    let calls = 0;
    const parsed = rectangleFromRaw({ ...slab, thickness: "0" }, () => {
      calls += 1;
      throw new Error("geometry should not run");
    });
    assert.equal(calls, 0);
    assert.equal(parsed.ok, false);
    if (parsed.ok) return;
    assert.match(parsed.issues[0]?.message ?? "", /greater than zero/i);
  });

  it("converts inches to feet before dividing by 27", () => {
    assert.equal(inchesToFeet(4), 4 / 12);
    const parsed = rectangleFromRaw(slab);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.ok(Math.abs(parsed.thickness - 4 / 12) < 1e-12);

    const treatedAsFeet = rectangleVolume({
      system: "us",
      length: 10,
      width: 10,
      thickness: 4,
      wastePercent: 0,
    });
    assert.notEqual(formatQuantity(treatedAsFeet.netCubicYards, "yards"), "1.23");
    assert.equal(formatQuantity(parsed.volume.netCubicYards, "yards"), "1.23");
  });

  it("keeps two decimals, including trailing zeros", () => {
    assert.equal(formatQuantity(1.2, "yards"), "1.20");
    assert.equal(formatQuantity(1.234, "yards"), "1.23");
  });

  it("matches a metric slab to the US slab within 0.01 yard", () => {
    const us = rectangleFromRaw(slab);
    assert.equal(us.ok, true);
    if (!us.ok) return;

    const lengthM = 10 * 0.3048;
    const thicknessM = (4 / 12) * 0.3048;
    const metric = rectangleVolume({
      system: "metric",
      length: lengthM,
      width: lengthM,
      thickness: thicknessM,
      wastePercent: 10,
    });

    const usDisplay = Number(formatQuantity(us.volume.orderCubicYards, "yards"));
    const metricDisplay = Number(formatQuantity(metric.orderCubicYards, "yards"));
    assert.ok(Math.abs(usDisplay - metricDisplay) <= 0.01);
    assert.equal(
      formatQuantity(us.volume.netCubicYards, "yards"),
      formatQuantity(metric.netCubicYards, "yards"),
    );
  });

  it("round-trips a length through the unit switch close to the original", () => {
    const metric = convertLengthParts(10, 0, "us", "metric");
    const back = convertLengthParts(Number(metric.primary), Number(metric.remainder), "metric", "us");
    const feet = feetAndInchesToFeet(Number(back.primary), Number(back.remainder));
    assert.ok(Math.abs(feet - 10) < 0.01);
  });
});
