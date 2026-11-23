import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pageWords } from "../content/pages";
import { sizePage, sizePages } from "../content/sizes";
import { concreteBag80, gravelDensity, mulchBag2 } from "../data/defaults";
import { concreteFigures, gravelFigures, mulchFigures } from "../lib/examples";
import { publicPaths } from "../lib/site";

describe("size pages", () => {
  it("keeps each page between 400 and 700 words", () => {
    for (const page of sizePages) {
      const words = pageWords(page);
      assert.ok(words >= 400 && words <= 700, `${page.path} has ${words} words`);
    }
  });

  it("gives every page its own path, title, and description", () => {
    for (const key of ["path", "title", "description", "h1"] as const) {
      const values = sizePages.map((page) => page[key]);
      assert.equal(new Set(values).size, values.length, `duplicate ${key}`);
    }
    for (const page of sizePages) {
      assert.equal((publicPaths as readonly string[]).includes(page.path), false, page.path);
      assert.equal(page.related.some((link) => link.href === page.path), false, page.path);
      assert.equal(page.faqs.length, 4);
    }
  });

  it("does not repeat the sizes the main slab and pad pages already work", () => {
    assert.equal(sizePage("concrete", "10x10"), undefined);
    assert.equal(sizePage("concrete", "12x16"), undefined);
  });

  it("prints the same figures the calculators produce", () => {
    for (const page of sizePages) {
      const input = {
        lengthFt: page.lengthFt,
        widthFt: page.widthFt,
        thicknessIn: page.depthIn,
        wastePercent: 10,
      };
      const text = [...page.intro, ...page.example.paragraphs, ...page.faqs.map((faq) => faq.answer)].join(" ");
      const row = page.table.rows.find((cells) => cells[0] === `${page.depthIn} in`);
      assert.ok(row, `${page.path} has no row for ${page.depthIn} in`);

      if (page.material === "concrete") {
        const f = concreteFigures({ ...input, yieldCubicFeet: concreteBag80.value });
        assert.match(text, new RegExp(f.orderYards));
        assert.match(text, new RegExp(`${f.bags} bags`));
        assert.deepEqual(row.slice(1, 4), [f.netYards, f.orderYards, f.bags]);
      } else if (page.material === "gravel") {
        const f = gravelFigures({ ...input, tonsPerCubicYard: gravelDensity.value });
        assert.match(text, new RegExp(`${f.tons} tons`));
        assert.deepEqual(row.slice(1), [f.netYards, f.orderYards, f.tons]);
      } else {
        const f = mulchFigures({ ...input, bagCubicFeet: mulchBag2.value });
        assert.match(text, new RegExp(`${f.bags} bags`));
        assert.deepEqual(row.slice(1, 3), [f.orderYards, f.bags]);
      }
    }
  });
});
