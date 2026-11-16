import { mulchBag15, mulchBag2, mulchBag3, wasteDefault } from "@/data/defaults";
import { mulchFigures } from "@/lib/examples";
import { formatDefault } from "@/lib/format";
import { concreteLink, gravelLink } from "./links";
import { homeCrumb, type CalculatorPage } from "./pages";

const bed = mulchFigures({
  lengthFt: 8,
  widthFt: 12,
  thicknessIn: 3,
  wastePercent: wasteDefault.value,
  bagCubicFeet: mulchBag2.value,
});

export const mulchPage: CalculatorPage = {
  path: "/mulch-calculator",
  title: "Mulch Calculator — Cubic Yards and Bags",
  description:
    "Mulch calculator for cubic yards and bags. Depth is in inches. Bag volume starts at 2 cu ft and can be switched to 1.5 or 3.",
  h1: "Mulch Calculator",
  intro: [
    "Type the length, width, and depth of a bed and read the cubic yards of mulch and the whole bags.",
    "The bag volume is a field, because bags are sold as 1.5, 2, and 3 cu ft, and the number printed on the bag is the one that counts.",
  ],
  crumbs: [homeCrumb(), { name: "Mulch Calculator" }],
  formula: {
    expression: "bags = ceil(length × width × depth × (1 + waste ÷ 100) ÷ bag volume)",
    symbols: [
      {
        symbol: "length, width, depth",
        definition:
          "The bed as a rectangle. Depth is inches in US mode. Three inches is 3 ÷ 12 foot. The page does not ask you to convert that yourself, and it does not treat the depth as feet.",
      },
      {
        symbol: "bag volume",
        definition:
          "Cubic feet in one bag. The select starts at 2 and can switch to 1.5 or 3, which refills the field. You can then type the volume your bag actually prints. The select does not lock the field.",
      },
      {
        symbol: "waste",
        definition:
          "Extra volume after the net, for a bed that is deeper at the edges or for mulch kicked out of the rectangle. It is not a product property. Zero is a valid entry.",
      },
      {
        symbol: "ceil",
        definition:
          "Bags round up. A remainder of 0.1 bag is one more bag. Yards stay at two decimals and are not replaced by the bag count.",
      },
      {
        symbol: "yards",
        definition:
          "The same volume divided by 27. Bulk mulch is sold by the yard. Bags are the other way to buy it. Both figures are on the result. Tons are not, because this page is not the gravel page.",
      },
    ],
  },
  example: {
    paragraphs: [
      `The example is a bed 8 ft by 12 ft at 3 in. Net volume is 8 × 12 × (3 ÷ 12) cubic feet, or ${bed.netYards} cu yd. A listed 2 cu ft bag covers 8 sq ft at 3 in, which is exactly those 2 cu ft. This bed is 96 sq ft, so the net is 12 of those bags before waste.`,
      `${wasteDefault.value}% waste moves the order to ${bed.orderYards} cu yd. Divided by a ${formatDefault(mulchBag2.value)} cu ft bag and rounded up, that order is ${bed.bags} bags. The result shows the net yards and the order yards side by side. It does not swap the net out for the padded figure.`,
      `Choose ${formatDefault(mulchBag15.value)} or ${formatDefault(mulchBag3.value)} cu ft and the field fills with that volume, still editable. The yards stay ${bed.orderYards} because bag size does not change how much space the bed holds. Only the bag count changes. There is no tonnage on this page.`,
    ],
  },
  faqs: [
    {
      question: "How many bags cover an 8 by 12 ft bed at 3 inches?",
      answer: `At ${formatDefault(mulchBag2.value)} cu ft per bag and ${wasteDefault.value}% waste, this bed is ${bed.bags} bags. The order is ${bed.orderYards} cu yd. The net, before waste, is ${bed.netYards} cu yd, which is 12 bags of 2 cu ft before the allowance and the round-up.`,
    },
    {
      question: "Why is coverage not a fixed area?",
      answer: `A 2 cu ft bag covers 8 sq ft only at 3 in. At 2 in the same bag covers more ground. This bed is ${bed.orderYards} cu yd to order because the depth is part of the multiplication. A coverage slogan without a depth is not a quantity.`,
    },
    {
      question: "What if the bag is 1.5 or 3 cubic feet?",
      answer: `Switch the select. The yield field becomes ${formatDefault(mulchBag15.value)} or ${formatDefault(mulchBag3.value)}, and you can type over it. The ${bed.bags} bag count belongs to the 2 cu ft bag. A different volume produces a different count from the same ${bed.orderYards} cu yd order.`,
    },
    {
      question: "Do I buy the net or the order?",
      answer: `Buy the order if you want the waste you typed. For this bed that is ${bed.orderYards} cu yd, or ${bed.bags} bags at 2 cu ft. The net of ${bed.netYards} cu yd is the bed with no allowance. Both stay visible so you can see what the percentage did.`,
    },
  ],
  related: [gravelLink, concreteLink],
  defaultNote: {
    before: `This bed starts at ${wasteDefault.value}% waste and a ${mulchBag2.label}, the dry volume listed for`,
    sourceName: mulchBag2.sourceName,
    sourceUrl: mulchBag2.sourceUrl,
    after: `, checked ${mulchBag2.lastVerified}. That listing also says one bag covers 8 sq ft at 3 in, which is the same 2 cu ft. The 1.5 and 3 cu ft options are other volumes printed on bags. Edit the field and the result uses your number. The bag wins.`,
  },
};
