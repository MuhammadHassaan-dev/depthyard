import { gravelDensity, wasteDefault } from "@/data/defaults";
import { gravelFigures } from "@/lib/examples";
import { formatDefault } from "@/lib/format";
import { concreteLink, mulchLink } from "./links";
import { homeCrumb, type CalculatorPage } from "./pages";

const path = gravelFigures({
  lengthFt: 10,
  widthFt: 20,
  thicknessIn: 3,
  wastePercent: wasteDefault.value,
  tonsPerCubicYard: gravelDensity.value,
});

const density = formatDefault(gravelDensity.value);

export const gravelPage: CalculatorPage = {
  path: "/gravel-calculator",
  title: "Gravel Calculator — Cubic Yards and Tons",
  description:
    "Gravel calculator for cubic yards and tons. Enter length, width, and depth. Density starts at 1.40 tons per cubic yard and stays editable.",
  h1: "Gravel Calculator",
  intro: [
    "Enter the length, width, and depth of a rectangle and read the cubic yards of gravel and the tons.",
    "The density is a labeled field, because wet gravel and dry gravel are not the same weight, and the page will not hide a single number inside the formula.",
  ],
  crumbs: [homeCrumb(), { name: "Gravel Calculator" }],
  formula: {
    expression: "tons = (length × width × depth ÷ 27) × (1 + waste ÷ 100) × density",
    symbols: [
      {
        symbol: "length, width, depth",
        definition:
          "A rectangular bed or path. Depth is in inches in US mode and is divided by 12 before the volume is turned into yards. Three inches of gravel is a quarter of a foot, not three feet.",
      },
      {
        symbol: "27",
        definition:
          "Cubic feet in a cubic yard. The net yards are the product in feet divided by 27. Waste has not been applied yet at that step.",
      },
      {
        symbol: "waste",
        definition:
          "A percentage on the net volume, for an uneven grade and for gravel that scatters past the bed. Zero is allowed. The order and the net are both shown.",
      },
      {
        symbol: "density",
        definition:
          "Tons per cubic yard. The field starts at the planning value below and uses whatever you type after that. Mulch does not use this factor. Gravel does, because gravel is ordered by the ton as often as by the yard.",
      },
      {
        symbol: "tons",
        definition:
          "Order yards times the density in the field. Change the density and the tons move. The yards do not, unless you also change the size or the waste.",
      },
    ],
  },
  example: {
    paragraphs: [
      `The example is a path 10 ft by 20 ft at 3 in deep. Net volume is 10 × 20 × (3 ÷ 12) cubic feet, which is ${path.netYards} cu yd. That is the gravel inside the rectangle before any allowance.`,
      `${wasteDefault.value}% waste makes the order ${path.orderYards} cu yd. The tons then use that order, not the net. At ${density} tons per cubic yard the order weighs ${path.tons} tons. If you type a different density, the ton figure follows your number and the result line names it.`,
      `A 2017 Rhode Island DOT coarse-aggregate report lists a loose unit weight of 103.85 lb per cubic foot for one 3/8 in sample, measured by AASHTO T 19. That is about ${density} tons per cubic yard, which is why the field starts there. Crusher run, wet stone, and other sizes weigh differently. The scale ticket on the truck wins. This page does not show a price and it does not publish a city-by-city copy of the same math.`,
    ],
  },
  faqs: [
    {
      question: "How many tons is a 10 by 20 ft path at 3 inches?",
      answer: `At ${density} tons per cubic yard and ${wasteDefault.value}% waste, this path is ${path.tons} tons. The order underneath that weight is ${path.orderYards} cu yd. The net, before waste, is ${path.netYards} cu yd.`,
    },
    {
      question: "Why is density a field instead of a constant?",
      answer: `Because ${density} is a starting value from one loose unit weight, not a law. Wet gravel weighs more. A stone with more fines weighs more. Type the tons per yard your supplier prints and the result uses it. The path's yards stay ${path.orderYards} until the size or the waste changes.`,
    },
    {
      question: "Does mulch use this tonnage?",
      answer: `No. Mulch is counted in yards and bags. This path's ${path.tons} tons would be the wrong unit for a bark bed. The mulch page shares the rectangle and then stops before the density multiplication.`,
    },
    {
      question: "What if the gravel is wet?",
      answer: `Raise the density. The ${path.tons} ton figure is only true at ${density} tons per cubic yard. Moisture can add a tenth or more, and the ticket will show it. The calculator will not guess a wet weight for you.`,
    },
  ],
  related: [concreteLink, mulchLink],
  defaultNote: {
    before: `This path starts at ${wasteDefault.value}% waste and ${density} tons per cubic yard, from a loose unit weight in the`,
    sourceName: gravelDensity.sourceName,
    sourceUrl: gravelDensity.sourceUrl,
    after: `, checked ${gravelDensity.lastVerified}. One 3/8 in sample is listed at 103.85 lb per cubic foot, about ${density} tons per cubic yard. Edit the density and the tons follow your number. The scale ticket wins if it disagrees.`,
  },
};
