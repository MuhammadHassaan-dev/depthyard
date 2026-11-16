import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { paintFromRaw, paintQuantity } from "../lib/calculators/paint";

const room = {
  system: "us" as const,
  lengthPrimary: "12",
  lengthRemainder: "",
  heightPrimary: "8",
  heightRemainder: "",
  walls: "4",
  coats: "2",
  coverage: "350",
  opening: "21",
};

describe("paint", () => {
  it("subtracts the opening once and multiplies by coats", () => {
    const result = paintQuantity({
      length: 10,
      height: 10,
      wallCount: 2,
      coats: 2,
      coverage: 100,
      openingArea: 20,
    });
    assert.equal(result.area, 180);
    assert.equal(result.gallons, 3.6);
  });

  it("rejects a coverage of 0 before the formula runs", () => {
    let calls = 0;
    const parsed = paintFromRaw({ ...room, coverage: "0" }, () => {
      calls += 1;
      throw new Error("paint formula should not run");
    });
    assert.equal(calls, 0);
    assert.equal(parsed.ok, false);
    if (parsed.ok) return;
    assert.match(parsed.issues[0]?.message ?? "", /greater than zero/i);
  });

  it("hides quarts once the gallon figure reaches 1", () => {
    const parsed = paintFromRaw(room);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.result.area, 363);
    assert.ok(parsed.result.gallons > 1);
    assert.equal(parsed.result.quarts, null);
  });

  it("reports quarts only while gallons stay under 1", () => {
    const result = paintQuantity({
      length: 8,
      height: 4,
      wallCount: 1,
      coats: 1,
      coverage: 350,
      openingArea: 0,
    });
    assert.ok(result.gallons < 1);
    assert.equal(result.quarts, Math.ceil(result.gallons * 4));
  });
});
