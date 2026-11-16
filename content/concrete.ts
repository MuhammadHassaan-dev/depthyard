import {
  concreteBag40,
  concreteBag60,
  concreteBag80,
  wasteDefault,
} from "@/data/defaults";
import { bagsForYield, concreteFigures } from "@/lib/examples";
import { formatDefault } from "@/lib/format";
import { bagLink, gravelLink, padLink, paintLink, slabLink } from "./links";
import { homeCrumb, type CalculatorPage, type DefaultNote } from "./pages";

const slab = concreteFigures({
  lengthFt: 10,
  widthFt: 10,
  thicknessIn: 4,
  wastePercent: wasteDefault.value,
  yieldCubicFeet: concreteBag80.value,
});

const pad = concreteFigures({
  lengthFt: 12,
  widthFt: 16,
  thicknessIn: 4,
  wastePercent: wasteDefault.value,
  yieldCubicFeet: concreteBag80.value,
});

const landing = concreteFigures({
  lengthFt: 6,
  widthFt: 8,
  thicknessIn: 4,
  wastePercent: wasteDefault.value,
  yieldCubicFeet: concreteBag80.value,
});

const workshop = concreteFigures({
  lengthFt: 15,
  widthFt: 20,
  thicknessIn: 5,
  wastePercent: wasteDefault.value,
  yieldCubicFeet: concreteBag80.value,
});

const landing60 = bagsForYield(landing.orderCubicFeet, concreteBag60.value);
const landing40 = bagsForYield(landing.orderCubicFeet, concreteBag40.value);
const yieldText = formatDefault(concreteBag80.value);

function concreteNote(opening: string): DefaultNote {
  return {
    before: `${opening} The yield starts from the approximate figure on the`,
    sourceName: concreteBag80.sourceName,
    sourceUrl: concreteBag80.sourceUrl,
    after: `, checked ${concreteBag80.lastVerified}. An ${concreteBag80.label} is listed at about ${yieldText} ${concreteBag80.unit}. Waste starts at ${wasteDefault.value}% and is a planning allowance, not a rule from that sheet. Edit either field and the result on screen uses your number. If the bag prints a different yield, the bag wins.`,
  };
}

const formula = {
  expression: "order cubic yards = (length × width × thickness ÷ 27) × (1 + waste ÷ 100)",
};

export const concretePage: CalculatorPage = {
  path: "/concrete-calculator",
  title: "Concrete Calculator — Cubic Yards and Bags",
  description:
    "Concrete calculator for cubic yards and bags. Enter length, width, and thickness. Waste and bag yield stay visible, and the order is not rounded to a quarter yard.",
  h1: "Concrete Calculator",
  intro: [
    "Type the length, width, and thickness of a rectangle and read the cubic yards and the whole bags.",
    "Waste and bag yield are fields with labels, so a 10% allowance is never hidden inside the formula.",
  ],
  crumbs: [homeCrumb(), { name: "Concrete Calculator" }],
  formula: {
    ...formula,
    symbols: [
      {
        symbol: "length, width",
        definition:
          "The two sides of the rectangle. Feet and inches are combined before the multiplication, and a metric entry is converted at the edge. The formula itself does not change.",
      },
      {
        symbol: "thickness",
        definition:
          "The depth of the pour. In US mode the box is inches, and those inches are divided by 12 before they meet the length and the width. Five inches is not five feet.",
      },
      {
        symbol: "27",
        definition:
          "Cubic feet in one cubic yard. Division by 27 happens only after the thickness is in feet, which is why a thin slab does not turn into a huge order.",
      },
      {
        symbol: "waste",
        definition:
          "A percentage added after the net volume. It is there for spillage and an uneven grade. Zero leaves the order equal to the net. Above 100% is rejected.",
      },
      {
        symbol: "bags",
        definition:
          "The order in cubic feet, divided by the yield of the bag you selected, then rounded up. A partial bag is still a bag to buy. Yards stay at two decimals and are not rounded up to a quarter yard.",
      },
    ],
  },
  example: {
    paragraphs: [
      `The worked example is a workshop floor 15 ft by 20 ft at 5 in, with ${wasteDefault.value}% waste and an ${concreteBag80.label} at ${yieldText} cu ft. The net volume is 15 × 20 × (5 ÷ 12) cubic feet. Divided by 27, that is ${workshop.netYards} cu yd.`,
      `Waste is applied to the net, not buried in the thickness. At ${wasteDefault.value}% the order is ${workshop.orderYards} cu yd. The bag count uses that same order in cubic feet, before the yard figure is shortened for display, so the two numbers cannot drift apart.`,
      `At ${yieldText} cu ft per ${concreteBag80.label}, the order is ${workshop.bags} bags. Bags round up. A plant may sell ready-mix in quarter-yard steps, and that rule belongs to the plant. This page shows ${workshop.orderYards} cu yd and does not invent the step. A patio, a shed pad, and a bag-first count each have their own page.`,
    ],
  },
  faqs: [
    {
      question: "How many yards is the 15 by 20 ft floor at 5 inches?",
      answer: `The net volume is ${workshop.netYards} cu yd. That is the concrete inside the forms before waste. The order, after the ${wasteDefault.value}% in the form, is ${workshop.orderYards} cu yd. Change the thickness and both figures move. There is no separate URL for a 5 in pour.`,
    },
    {
      question: "Where does the bag yield come from?",
      answer: `The ${concreteBag80.label} field starts at ${yieldText} cu ft, the approximate yield on the QUIKRETE Concrete Mix No. 1101 data sheet. The 60 lb and 40 lb options start at ${formatDefault(concreteBag60.value)} and ${formatDefault(concreteBag40.value)} cu ft from the same sheet. This floor's order is ${workshop.bags} bags only while the yield stays ${yieldText}. Type the number printed on your bag and the count follows that number.`,
    },
    {
      question: "What happens if waste is set to zero?",
      answer: `The order becomes the net. On this 15 by 20 ft floor that means ${workshop.netYards} cu yd, not ${workshop.orderYards}. Nothing adds a hidden yard back. Waste is your subgrade and your spillage, and the field will accept 0.`,
    },
    {
      question: "Is this the only concrete calculator?",
      answer: `No. It is one rectangle calculator, and the head term is crowded. The slab page works a 10 by 10 ft patio to ${slab.netYards} cu yd net. The pad page works a different footprint. Use whichever example matches the job, and check a supplier before you treat ${workshop.orderYards} cu yd as an order they will load.`,
    },
  ],
  related: [slabLink, gravelLink, paintLink],
  defaultNote: concreteNote(
    `The floor example starts at ${wasteDefault.value}% waste and an ${concreteBag80.label} yielding ${yieldText} cu ft.`,
  ),
};

export const slabPage: CalculatorPage = {
  path: "/concrete-slab-calculator",
  title: "Concrete Slab Calculator — Patio, Floor, and Shed Slab",
  description:
    "Concrete slab calculator for a patio, floor, or shed slab. Read cubic yards and 40, 60, or 80 lb bags from the length, width, and thickness you type.",
  h1: "Concrete Slab Calculator",
  intro: [
    "A slab calculator turns the length, width, and thickness of a patio, floor, or shed slab into cubic yards and whole bags.",
    "Thickness stays an input on this page, and the waste percentage sits in the form instead of hiding inside the formula.",
  ],
  crumbs: [homeCrumb(), { name: "Concrete Slab Calculator" }],
  formula: {
    ...formula,
    symbols: [
      {
        symbol: "length, width",
        definition:
          "The patio or floor measured on the flat. The second box is leftover inches, and 14 inches stays 14. The calculator adds them. It does not rewrite the feet while you type.",
      },
      {
        symbol: "thickness",
        definition:
          "Slab depth in inches in US mode. Four inches becomes 4 ÷ 12 foot before the volume is multiplied. Treating 4 as four feet would invent a slab no one is pouring.",
      },
      {
        symbol: "waste",
        definition:
          "Added after the net cubic yards. A patio over soft grade may want more than a floor on a compacted base. The starting value is a suggestion you can erase.",
      },
      {
        symbol: "27",
        definition:
          "The bridge from cubic feet to cubic yards. It is applied to the full product, not to a thickness that is still in inches.",
      },
      {
        symbol: "bags",
        definition:
          "Ceil of order cubic feet divided by bag yield. The slab page leads with yards. Bags are the second figure, still rounded up, because a store sells a whole bag.",
      },
    ],
  },
  example: {
    paragraphs: [
      `This page's example is a 10 ft by 10 ft patio poured 4 in thick. Net volume is 10 × 10 × (4 ÷ 12) cubic feet, which is ${slab.netYards} cu yd after dividing by 27. The arithmetic is the same function the form calls, so the sentence cannot drift from the result.`,
      `At ${wasteDefault.value}% waste the order is ${slab.orderYards} cu yd. The waste is not folded into the 4 in thickness. Set the field to 0 and the order drops back to ${slab.netYards} cu yd, with no phantom yard left behind.`,
      `An ${concreteBag80.label} at ${yieldText} cu ft does not divide that order into a whole number of bags. Rounded up, the patio is ${slab.bags} bags. A ready-mix plant may still sell in quarter-yard steps. This page can say so, and it still displays ${slab.orderYards} rather than a step it does not know.`,
    ],
  },
  faqs: [
    {
      question: "How many yards is a 10 by 10 slab at 4 inches?",
      answer: `The net volume for this 10 ft by 10 ft patio at 4 in is ${slab.netYards} cu yd. That is the concrete inside the forms before waste. It is not the number to order until you add the waste you typed.`,
    },
    {
      question: "What does 10% waste do to that patio?",
      answer: `On this patio, ${wasteDefault.value}% waste moves the order from ${slab.netYards} cu yd to ${slab.orderYards} cu yd. The percentage is visible above the result. Clear it if the grade is already true and you do not want the allowance.`,
    },
    {
      question: "How many 80 lb bags is that order?",
      answer: `At ${yieldText} cu ft per ${concreteBag80.label}, this patio's order is ${slab.bags} bags. The count rounds up from the order in cubic feet. Switching the select to 60 lb or 40 lb refills the yield, and you can still type over it.`,
    },
    {
      question: "Does this page round the order up to the next quarter yard?",
      answer: `No. The order stays ${slab.orderYards} cu yd. Quarter-yard selling is a plant practice and it changes. Publishing it here would pretend a local rule is a fact. Ask the plant. The ${slab.bags} bags are a separate, whole-bag round-up for a store purchase.`,
    },
  ],
  related: [padLink, gravelLink, paintLink],
  defaultNote: concreteNote(
    `The patio starts at ${wasteDefault.value}% waste and an ${concreteBag80.label} yielding ${yieldText} cu ft.`,
  ),
};

export const padPage: CalculatorPage = {
  path: "/concrete-pad-calculator",
  title: "Concrete Pad Calculator — Cubic Yards for a Pad",
  description:
    "Concrete pad calculator for cubic yards under a shed or equipment pad. Enter the rectangle and the thickness. Waste and bag yield stay on the form.",
  h1: "Concrete Pad Calculator",
  intro: [
    "A pad calculator gives the cubic yards and bags for a rectangular shed pad or equipment pad.",
    "The geometry is a rectangle, and this page keeps its own example so it is not the patio page with the noun swapped.",
  ],
  crumbs: [homeCrumb(), { name: "Concrete Pad Calculator" }],
  formula: {
    ...formula,
    symbols: [
      {
        symbol: "length, width",
        definition:
          "The outside of the forms for the pad. Measure the rectangle you will actually pour, including the width of the form only if that concrete is part of the pad.",
      },
      {
        symbol: "thickness",
        definition:
          "Pad thickness in inches. A 4 in pad is 4 ÷ 12 foot thick in the product. The page does not assume you already converted it, and it does not offer a URL per thickness.",
      },
      {
        symbol: "waste",
        definition:
          "Extra volume after the net, for a base that is not perfectly flat and for concrete left in the wheelbarrow. It is not a structural safety factor. A pad that carries a building still needs a builder to size the thickness.",
      },
      {
        symbol: "27",
        definition:
          "Cubic feet per cubic yard, applied after the inches have become feet. The pad order and the patio order use this same divisor. Their examples do not.",
      },
      {
        symbol: "bags",
        definition:
          "Whole bags from the order in cubic feet and the yield in the field. Yards remain the emphasis on this page, because a pad this size is often a plant order. The bag count is still there if you are buying sacks.",
      },
    ],
  },
  example: {
    paragraphs: [
      `The example is a shed pad 12 ft by 16 ft at 4 in. Net volume is 12 × 16 × (4 ÷ 12) cubic feet, or ${pad.netYards} cu yd. That is a different footprint from the 10 by 10 patio, and the sentences here are written for the shed, not copied from it.`,
      `${wasteDefault.value}% waste brings the order to ${pad.orderYards} cu yd. The allowance sits in the waste field. It is not a code minimum and it is not a hidden 10% inside the thickness. A compacted base may let you lower it. A soft spot may make you raise it.`,
      `With an ${concreteBag80.label} at ${yieldText} cu ft, the pad is ${pad.bags} bags, rounded up. Many sheds this size are ordered from a plant in yards, so ${pad.orderYards} cu yd is the figure to read first. This page does not round that yard figure to the next quarter. It also does not design the pad. Thickness, reinforcement, and soil are outside a quantity.`,
    ],
  },
  faqs: [
    {
      question: "How many yards is a 12 by 16 ft pad at 4 inches?",
      answer: `Net volume for this shed pad is ${pad.netYards} cu yd. After ${wasteDefault.value}% waste the order is ${pad.orderYards} cu yd. Both numbers stay on the result. The order does not replace the net.`,
    },
    {
      question: "Why is the pad page separate from the slab page?",
      answer: `The formula matches, and the story does not. The slab page's patio is ${slab.netYards} cu yd net. This shed pad is ${pad.netYards} cu yd net before waste. A reader who wanted a pad should not have to translate a patio paragraph. Thickness is still just an input.`,
    },
    {
      question: "How many 80 lb bags does this pad need?",
      answer: `At ${yieldText} cu ft each, the order is ${pad.bags} bags. That count uses the waste you left in the form. Change the yield to the number on your bag and the bag figure changes with it. The yards do not depend on the bag.`,
    },
    {
      question: "Will a plant sell exactly the order shown?",
      answer: `Not necessarily. The page shows ${pad.orderYards} cu yd. A plant may step that up to the next quarter yard, and the step is theirs. This calculator will not pretend the step is universal, and it will not show a price.`,
    },
  ],
  related: [bagLink, gravelLink, paintLink],
  defaultNote: concreteNote(
    `The shed pad starts at ${wasteDefault.value}% waste and an ${concreteBag80.label} yielding ${yieldText} cu ft.`,
  ),
};

export const bagPage: CalculatorPage = {
  path: "/concrete-bag-calculator",
  title: "Concrete Bag Calculator — 40, 60, and 80 lb Bags",
  description:
    "Concrete bag calculator for 40, 60, and 80 lb bags. The count rounds up from cubic feet. Cubic yards stay visible for a plant order.",
  h1: "Concrete Bag Calculator",
  intro: [
    "The bag calculator leads with the number of bags, rounded up, for a 40, 60, or 80 lb mix.",
    "Yards stay on the page because a plant order is still in yards, and the yield in the form is the one the count uses.",
  ],
  crumbs: [homeCrumb(), { name: "Concrete Bag Calculator" }],
  formula: {
    expression: "bags = ceil(order cubic feet ÷ yield)",
    symbols: [
      {
        symbol: "order cubic feet",
        definition:
          "Length × width × thickness, with thickness converted from inches to feet, then multiplied by 1 plus waste. The bag math uses this cubic-foot order, not the yard figure after it has been shortened to two decimals.",
      },
      {
        symbol: "yield",
        definition:
          "Cubic feet one bag produces. The select fills 0.30, 0.45, or 0.60 from the QUIKRETE sheet and then leaves the field editable. Brands differ by a few hundredths. The printed yield wins.",
      },
      {
        symbol: "ceil",
        definition:
          "Round up to the next whole bag. A remainder of a tenth of a bag is still another bag to buy. An exact division stays on that whole number and is not rounded up again.",
      },
      {
        symbol: "yards",
        definition:
          "The same order divided by 27, shown beside the bags. Yards are how a plant talks. Bags are how a store talks. Hiding the yards would make a plant order harder, so they remain.",
      },
      {
        symbol: "waste",
        definition:
          "Applied before the bag division. Ten percent more concrete is ten percent more bags, then the ceil. It is not applied a second time.",
      },
    ],
  },
  example: {
    paragraphs: [
      `The example is a 6 ft by 8 ft landing, 4 in thick. The result leads with bags. At ${yieldText} cu ft for an ${concreteBag80.label}, and ${wasteDefault.value}% waste, the landing is ${landing.bags} bags. Net volume is ${landing.netYards} cu yd and the order is ${landing.orderYards} cu yd, so a plant number is still in view.`,
      `The order in cubic feet is what gets divided. Switching the select does not change the yards. It changes the yield and therefore the bags. The same order is ${landing60} bags at a 60 lb yield of ${formatDefault(concreteBag60.value)} cu ft, and ${landing40} bags at a 40 lb yield of ${formatDefault(concreteBag40.value)} cu ft.`,
      `Those three counts are produced by the same function as the form. If you type a yield that is not one of the three starting values, the result line stops naming the bag weight and names your number instead. A partial last bag still counts as a full bag. The yard display does not jump to the next quarter yard.`,
    ],
  },
  faqs: [
    {
      question: "How many 80 lb bags does the landing need?",
      answer: `This 6 by 8 ft landing at 4 in needs ${landing.bags} bags of the ${concreteBag80.label} when the yield is ${yieldText} cu ft and waste is ${wasteDefault.value}%. The big figure is the bag count. ${landing.orderYards} cu yd is the order beside it.`,
    },
    {
      question: "Why does the bag count round up?",
      answer: `Because you cannot buy a fraction of a bag. The landing's order does not land on a whole number of ${yieldText} cu ft bags, so the count is ${landing.bags}, not the truncated value underneath it. An order that divides exactly is left alone.`,
    },
    {
      question: "How many bags if the sack is 60 lb or 40 lb?",
      answer: `The same landing and the same ${wasteDefault.value}% waste become ${landing60} bags at ${formatDefault(concreteBag60.value)} cu ft, or ${landing40} bags at ${formatDefault(concreteBag40.value)} cu ft. The yards stay ${landing.orderYards}. Only the yield changed.`,
    },
    {
      question: "Should I ignore the yards if I am buying bags?",
      answer: `Keep them. ${landing.orderYards} cu yd is the plant version of this landing, and ${landing.bags} is the store version at the 80 lb yield. A supplier who talks in yards will not take a bag count as the order. Read the figure that matches how you are buying.`,
    },
  ],
  related: [slabLink, gravelLink, paintLink],
  defaultNote: concreteNote(
    `The landing starts at ${wasteDefault.value}% waste and an ${concreteBag80.label} yielding ${yieldText} cu ft.`,
  ),
};

export const concretePages = [concretePage, slabPage, padPage, bagPage];
