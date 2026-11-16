import { paintCoats, paintCoverage } from "@/data/defaults";
import { paintFigures } from "@/lib/examples";
import { concreteLink, homeLink } from "./links";
import { homeCrumb, type CalculatorPage } from "./pages";

const room = paintFigures({
  lengthFt: 12,
  heightFt: 8,
  walls: 4,
  coats: paintCoats.value,
  coverage: paintCoverage.value,
  openingSqFt: 21,
});

export const paintPage: CalculatorPage = {
  path: "/paint-calculator",
  title: "Paint Calculator — Gallons for a Room",
  description:
    "Paint calculator for gallons in a room. Enter wall length, height, walls, and coats. Coverage starts at 350 sq ft per gallon and stays editable.",
  h1: "Paint Calculator",
  intro: [
    "Enter the wall length, the wall height, the number of walls, and the coats, and read the gallons.",
    "Coverage is a field because the can prints the real number, and an opening you type is subtracted once from the whole job.",
  ],
  crumbs: [homeCrumb(), { name: "Paint Calculator" }],
  formula: {
    expression: "gallons = (length × height × walls − openings) × coats ÷ coverage",
    symbols: [
      {
        symbol: "length, height",
        definition:
          "One wall's size. In US mode the boxes are feet and inches. In metric mode they are meters and centimeters. The formula runs after that conversion, in square feet and square feet per gallon.",
      },
      {
        symbol: "walls",
        definition:
          "How many walls share that length and height. A room with a shorter wall should be entered as its own length, or the opening field has to carry the difference. The count has to be greater than zero.",
      },
      {
        symbol: "openings",
        definition:
          "Doors and windows, in square feet, subtracted once from the total wall area. The label says once, not once per wall. Leave the field blank and the subtraction is zero.",
      },
      {
        symbol: "coats",
        definition:
          "The field starts at 2 because interior latex sheets specify two coats for a complete job. One coat is a real job. Zero coats is rejected, because a zero gallon result would look like an answer.",
      },
      {
        symbol: "coverage",
        definition:
          "Square feet per gallon in US mode, square meters per liter in metric mode. The sheet used here prints a range. The field starts at the low end. A porous wall uses more paint than a smooth painted one, so lower the coverage if the surface is thirsty.",
      },
    ],
  },
  example: {
    paragraphs: [
      `The example is a room with four walls, each 12 ft long and 8 ft high, two coats, and 21 sq ft of openings for a door. Gross area is 12 × 8 × 4 = 384 sq ft. Subtract the door once and the paintable area is ${room.area} sq ft.`,
      `At ${paintCoverage.value} sq ft per gallon and ${paintCoats.value} coats, the gallons are 363 × 2 ÷ 350, which displays as ${room.gallons}. Gallons keep one decimal. The door is not removed four times. Removing it once is the whole subtraction.`,
      `Quarts appear only when the gallon figure is under 1. This room is ${room.gallons} gallons, so the quart line stays off. Coverage on the Sherwin-Williams ProMar 200 sheet is 350–400 sq ft per gallon at 4 mils wet. Starting at 350 keeps the estimate off the optimistic end. The can in your hand wins if it prints another number. A porous or unpainted wall will use more than a smooth one.`,
    ],
  },
  faqs: [
    {
      question: "How many gallons does this room take?",
      answer: `Four 12 by 8 ft walls, minus 21 sq ft, at ${paintCoats.value} coats and ${paintCoverage.value} sq ft per gallon, is ${room.gallons} gallons. The paintable area is ${room.area} sq ft. Change a coat or the coverage and the gallon figure moves with the form. There is no Calculate button.`,
    },
    {
      question: "Why is the door subtracted once?",
      answer: `The opening belongs to the room, not to every wall. This example removes 21 sq ft from 384 sq ft and paints ${room.area} sq ft. Subtracting the door on each of the four walls would hide 84 sq ft and under-buy the paint. The field label says the subtraction happens once.`,
    },
    {
      question: "What if the can does not say 350?",
      answer: `Type the can's number. ${room.gallons} gallons is true only at ${paintCoverage.value} sq ft per gallon and ${paintCoats.value} coats on this room. The data sheet's range is 350–400 for a smooth film. A lower coverage means more gallons. The result line names the coverage it used.`,
    },
    {
      question: "When does the quart line show?",
      answer: `Only when gallons are under 1. This room needs ${room.gallons} gallons, so quarts stay hidden. A small patch that comes out under one gallon gets a quart count, rounded up, beside the gallon figure. Quarts are a second line, not a replacement.`,
    },
  ],
  related: [homeLink, concreteLink],
  defaultNote: {
    before: `Coverage starts at ${paintCoverage.value} sq ft per gallon, the low end of the range on the`,
    sourceName: paintCoverage.sourceName,
    sourceUrl: paintCoverage.sourceUrl,
    after: `, checked ${paintCoverage.lastVerified}. That sheet prints 350–400 sq ft per gallon at 4 mils wet. Coats start at ${paintCoats.value}, from interior latex sheets that specify two coats. Edit either field and the gallons use your number. The can wins if it disagrees. The figure assumes a smooth painted surface.`,
  },
};
