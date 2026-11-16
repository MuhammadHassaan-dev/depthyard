import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { concreteBags } from "../lib/calculators/concrete";
import { rectangleFromRaw } from "../lib/calculators/volume";
import { formatQuantity } from "../lib/format";

describe("concrete bags", () => {
  it("rounds the 10 by 10 by 4 in order up to 62 bags at 0.60 cu ft", () => {
    const parsed = rectangleFromRaw({
      system: "us",
      lengthPrimary: "10",
      lengthRemainder: "",
      widthPrimary: "10",
      widthRemainder: "",
      thickness: "4",
      waste: "10",
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(concreteBags(parsed.volume.orderCubicFeet, 0.6), 62);
    assert.equal(formatQuantity(62, "bags"), "62");
  });

  it("does not round an exact bag count up again", () => {
    assert.equal(concreteBags(36, 0.6), 60);
  });
});
