import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bagPage, concretePage, padPage, slabPage } from "../content/concrete";
import { gravelPage } from "../content/gravel";
import { mulchPage } from "../content/mulch";
import { pageWords, type CalculatorPage } from "../content/pages";
import { paintPage } from "../content/paint";
import { concreteBag40, concreteBag60, concreteBag80 } from "../data/defaults";
import { bagsForYield, concreteFigures, gravelFigures, mulchFigures, paintFigures } from "../lib/examples";

const pages: CalculatorPage[] = [
  concretePage,
  slabPage,
  padPage,
  bagPage,
  gravelPage,
  mulchPage,
  paintPage,
];

describe("calculator pages", () => {
  it("keeps each page between 400 and 700 words", () => {
    const counts = pages.map((page) => `${page.path} ${pageWords(page)}`);
    for (const page of pages) {
      const words = pageWords(page);
      assert.ok(words >= 400 && words <= 700, `${page.path} has ${words} words\n${counts.join("\n")}`);
    }
  });

  it("asks four questions and keeps the current page out of its related list", () => {
    for (const page of pages) {
      assert.equal(page.faqs.length, 4);
      assert.equal(
        page.related.some((link) => link.href === page.path),
        false,
      );
    }
  });

  it("prints the same figures the calculators produce", () => {
    const slab = concreteFigures({
      lengthFt: 10,
      widthFt: 10,
      thicknessIn: 4,
      wastePercent: 10,
      yieldCubicFeet: concreteBag80.value,
    });
    const pad = concreteFigures({
      lengthFt: 12,
      widthFt: 16,
      thicknessIn: 4,
      wastePercent: 10,
      yieldCubicFeet: concreteBag80.value,
    });
    const landing = concreteFigures({
      lengthFt: 6,
      widthFt: 8,
      thicknessIn: 4,
      wastePercent: 10,
      yieldCubicFeet: concreteBag80.value,
    });
    const workshop = concreteFigures({
      lengthFt: 15,
      widthFt: 20,
      thicknessIn: 5,
      wastePercent: 10,
      yieldCubicFeet: concreteBag80.value,
    });
    const gravel = gravelFigures({
      lengthFt: 10,
      widthFt: 20,
      thicknessIn: 3,
      wastePercent: 10,
      tonsPerCubicYard: 1.4,
    });
    const mulch = mulchFigures({
      lengthFt: 8,
      widthFt: 12,
      thicknessIn: 3,
      wastePercent: 10,
      bagCubicFeet: 2,
    });
    const paint = paintFigures({
      lengthFt: 12,
      heightFt: 8,
      walls: 4,
      coats: 2,
      coverage: 350,
      openingSqFt: 21,
    });

    const slabText = [...slabPage.example.paragraphs, ...slabPage.faqs.map((faq) => faq.answer)].join(" ");
    assert.match(slabText, new RegExp(slab.netYards));
    assert.match(slabText, new RegExp(slab.orderYards));
    assert.match(slabText, new RegExp(slab.bags));

    const padText = padPage.example.paragraphs.join(" ");
    assert.match(padText, new RegExp(pad.netYards));
    assert.match(padText, new RegExp(pad.bags));
    assert.equal(padPage.example.paragraphs.some((paragraph) => slabPage.example.paragraphs.includes(paragraph)), false);

    const bagText = bagPage.example.paragraphs.join(" ");
    assert.match(bagText, new RegExp(landing.bags));
    assert.match(bagText, new RegExp(bagsForYield(landing.orderCubicFeet, concreteBag60.value)));
    assert.match(bagText, new RegExp(bagsForYield(landing.orderCubicFeet, concreteBag40.value)));

    assert.match(concretePage.example.paragraphs.join(" "), new RegExp(workshop.orderYards));
    assert.match(gravelPage.example.paragraphs.join(" "), new RegExp(gravel.tons));
    assert.match(mulchPage.example.paragraphs.join(" "), new RegExp(mulch.bags));
    assert.match(paintPage.example.paragraphs.join(" "), new RegExp(paint.gallons));
    assert.match(paintPage.example.paragraphs.join(" "), new RegExp(paint.area));
  });
});
