import {
  concreteBag40,
  concreteBag60,
  concreteBag80,
  gravelDensity,
  mulchBag2,
  mulchBag3,
  wasteDefault,
} from "@/data/defaults";
import { bagsForYield, concreteFigures, gravelFigures, mulchFigures } from "@/lib/examples";
import { formatDefault } from "@/lib/format";
import { concreteNote, slabPage } from "./concrete";
import { gravelPage } from "./gravel";
import { mulchPage } from "./mulch";
import { homeCrumb, type CalculatorPage, type RelatedLink } from "./pages";

export type SizeMaterial = "concrete" | "gravel" | "mulch";

/** A comparison table printed under the calculator, one row per depth. */
export type SizeTable = {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type SizePage = CalculatorPage & {
  material: SizeMaterial;
  slug: string;
  lengthFt: number;
  widthFt: number;
  depthIn: number;
  table: SizeTable;
};

type SizeSpec = { lengthFt: number; widthFt: number; depthIn: number; use: string };

const waste = wasteDefault.value;
const yield80 = formatDefault(concreteBag80.value);
const density = formatDefault(gravelDensity.value);

function slug(spec: SizeSpec): string {
  return `${spec.lengthFt}x${spec.widthFt}`;
}

function area(spec: SizeSpec): number {
  return spec.lengthFt * spec.widthFt;
}

function yardsPerInch(spec: SizeSpec): string {
  return (area(spec) / 12 / 27).toFixed(2);
}

function cubicFeet(spec: SizeSpec, depthIn: number): string {
  const value = (area(spec) * depthIn) / 12;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

const concreteSpecs: readonly SizeSpec[] = [
  { lengthFt: 10, widthFt: 12, depthIn: 4, use: "patio or shed base" },
  { lengthFt: 12, widthFt: 12, depthIn: 4, use: "square patio" },
  { lengthFt: 10, widthFt: 20, depthIn: 4, use: "long patio or parking pad" },
  { lengthFt: 20, widthFt: 20, depthIn: 4, use: "garage floor or large patio" },
  { lengthFt: 24, widthFt: 24, depthIn: 4, use: "two-car garage floor" },
  { lengthFt: 30, widthFt: 40, depthIn: 4, use: "shop or barn floor" },
];

const gravelSpecs: readonly SizeSpec[] = [
  { lengthFt: 10, widthFt: 10, depthIn: 3, use: "patio base or small pad" },
  { lengthFt: 12, widthFt: 20, depthIn: 4, use: "parking pad" },
  { lengthFt: 10, widthFt: 50, depthIn: 4, use: "single-lane driveway" },
  { lengthFt: 20, widthFt: 50, depthIn: 4, use: "double-wide driveway" },
];

const mulchSpecs: readonly SizeSpec[] = [
  { lengthFt: 4, widthFt: 8, depthIn: 3, use: "raised bed or small border" },
  { lengthFt: 3, widthFt: 20, depthIn: 3, use: "foundation border" },
  { lengthFt: 10, widthFt: 10, depthIn: 3, use: "square garden bed" },
  { lengthFt: 6, widthFt: 30, depthIn: 3, use: "long front bed" },
];

function neighbors(
  specs: readonly SizeSpec[],
  index: number,
  link: (spec: SizeSpec) => RelatedLink,
): RelatedLink[] {
  const others = specs.filter((_, i) => i !== index);
  const before = specs[index - 1];
  const after = specs[index + 1];
  const picked = [before, after].filter((spec): spec is SizeSpec => Boolean(spec));
  for (const spec of others) {
    if (picked.length >= 2) break;
    if (!picked.includes(spec)) picked.push(spec);
  }
  return picked.slice(0, 2).map(link);
}

function concreteFor(spec: SizeSpec, depthIn: number, yieldCubicFeet = concreteBag80.value) {
  return concreteFigures({
    lengthFt: spec.lengthFt,
    widthFt: spec.widthFt,
    thicknessIn: depthIn,
    wastePercent: waste,
    yieldCubicFeet,
  });
}

function concreteLinkFor(spec: SizeSpec): RelatedLink {
  const f = concreteFor(spec, spec.depthIn);
  return {
    href: `/concrete-slab-calculator/${slug(spec)}`,
    title: `${spec.lengthFt} x ${spec.widthFt} slab`,
    summary: `${f.orderYards} cu yd or ${f.bags} bags of 80 lb at ${spec.depthIn} in.`,
  };
}

function concretePage(spec: SizeSpec, index: number): SizePage {
  const L = spec.lengthFt;
  const W = spec.widthFt;
  const d = spec.depthIn;
  const base = concreteFor(spec, d);
  const five = concreteFor(spec, 5);
  const six = concreteFor(spec, 6);
  const bags60 = bagsForYield(base.orderCubicFeet, concreteBag60.value);
  const bags40 = bagsForYield(base.orderCubicFeet, concreteBag40.value);
  const handMix = Number(base.bags) > 90;

  return {
    material: "concrete",
    slug: slug(spec),
    lengthFt: L,
    widthFt: W,
    depthIn: d,
    path: `/concrete-slab-calculator/${slug(spec)}`,
    title: `Concrete for a ${L}x${W} Slab — Yards and Bags`,
    description: `How much concrete for a ${L} by ${W} slab? At ${d} in it is ${base.netYards} cu yd, ${base.orderYards} cu yd with ${waste}% waste, or ${base.bags} bags of 80 lb. Table for 4, 5, and 6 in.`,
    h1: `Concrete for a ${L} x ${W} Slab`,
    intro: [
      `A ${L} by ${W} ft ${spec.use} poured ${d} in thick holds ${base.netYards} cubic yards of concrete, and ${base.orderYards} cu yd once ${waste}% waste is added.`,
      "The form below starts at that size. The table under it repeats the count at other thicknesses, so you can compare before you set the forms.",
    ],
    crumbs: [
      homeCrumb(),
      { name: "Concrete Slab Calculator", path: "/concrete-slab-calculator" },
      { name: `${L} x ${W} slab` },
    ],
    formula: slabPage.formula,
    example: {
      paragraphs: [
        `Area comes first: ${L} × ${W} = ${area(spec)} sq ft. At ${d} in the slab is ${area(spec)} × (${d} ÷ 12) = ${cubicFeet(spec, d)} cubic feet, and dividing by 27 gives ${base.netYards} cu yd net.`,
        `Waste is added to the net, not folded into the thickness. At ${waste}% the order is ${base.orderYards} cu yd. Pour it at 5 in and the order becomes ${five.orderYards} cu yd. At 6 in it reaches ${six.orderYards} cu yd.`,
        handMix
          ? `In bags, the ${d} in order is ${base.bags} bags of the ${concreteBag80.label} size at ${yield80} cu ft each. That is a lot of mixing by hand, so compare it with a ready-mix quote for ${base.orderYards} cu yd. The plant sets its own minimum and step.`
          : `In bags, the ${d} in order is ${base.bags} bags of the ${concreteBag80.label} size at ${yield80} cu ft each. The count rounds up, because a store sells whole bags. A ready-mix plant can quote the same ${base.orderYards} cu yd if you would rather not mix.`,
      ],
    },
    faqs: [
      {
        question: `How many yards of concrete for a ${L}x${W} slab?`,
        answer: `At ${d} in, ${base.netYards} cu yd net and ${base.orderYards} cu yd to order with ${waste}% waste. Set the waste field to 0 and the order falls back to ${base.netYards} cu yd.`,
      },
      {
        question: `How many 80 lb bags for a ${L}x${W} slab?`,
        answer: `${base.bags} bags at ${yield80} cu ft per bag, from the ${base.orderYards} cu yd order. With 60 lb bags it is ${bags60}. With 40 lb bags it is ${bags40}.`,
      },
      {
        question: `How much more concrete does a 6 inch ${L}x${W} slab need?`,
        answer: `Going from ${d} to 6 in takes the order from ${base.orderYards} to ${six.orderYards} cu yd, or ${six.bags} bags of 80 lb. Volume scales with thickness, so a slab half again as thick needs half again as much concrete.`,
      },
      {
        question: `What is the square footage of a ${L}x${W} slab?`,
        answer: `${area(spec)} sq ft. Each inch of thickness on that area is ${yardsPerInch(spec)} cu yd before waste, which is a quick way to check a quote or a delivery ticket.`,
      },
    ],
    related: [
      {
        href: "/concrete-slab-calculator",
        title: "Concrete slab calculator",
        summary: "Any length, width, and thickness, with waste and bag yield on the form.",
      },
      ...neighbors(concreteSpecs, index, concreteLinkFor),
    ],
    defaultNote: concreteNote(
      `This ${L} by ${W} slab starts at ${waste}% waste and an ${concreteBag80.label} yielding ${yield80} cu ft.`,
    ),
    table: {
      caption: `Concrete for a ${L} x ${W} ft slab with ${waste}% waste`,
      headers: ["Thickness", "Net cu yd", "Order cu yd", "80 lb bags", "60 lb bags"],
      rows: [4, 5, 6].map((depth) => {
        const f = concreteFor(spec, depth);
        return [
          `${depth} in`,
          f.netYards,
          f.orderYards,
          f.bags,
          bagsForYield(f.orderCubicFeet, concreteBag60.value),
        ];
      }),
    },
  };
}

function gravelFor(spec: SizeSpec, depthIn: number) {
  return gravelFigures({
    lengthFt: spec.lengthFt,
    widthFt: spec.widthFt,
    thicknessIn: depthIn,
    wastePercent: waste,
    tonsPerCubicYard: gravelDensity.value,
  });
}

function gravelLinkFor(spec: SizeSpec): RelatedLink {
  const f = gravelFor(spec, spec.depthIn);
  return {
    href: `/gravel-calculator/${slug(spec)}`,
    title: `${spec.lengthFt} x ${spec.widthFt} gravel area`,
    summary: `${f.orderYards} cu yd or ${f.tons} tons at ${spec.depthIn} in.`,
  };
}

function gravelSizePage(spec: SizeSpec, index: number): SizePage {
  const L = spec.lengthFt;
  const W = spec.widthFt;
  const d = spec.depthIn;
  const base = gravelFor(spec, d);
  const six = gravelFor(spec, 6);
  const depths = [2, 3, 4, 6];

  return {
    material: "gravel",
    slug: slug(spec),
    lengthFt: L,
    widthFt: W,
    depthIn: d,
    path: `/gravel-calculator/${slug(spec)}`,
    title: `Gravel for a ${L}x${W} Area — Yards and Tons`,
    description: `How much gravel for a ${L} by ${W} area? At ${d} in deep it is ${base.orderYards} cu yd with ${waste}% waste, about ${base.tons} tons. Table for 2, 3, 4, and 6 in.`,
    h1: `Gravel for a ${L} x ${W} Area`,
    intro: [
      `A ${L} by ${W} ft ${spec.use} spread ${d} in deep takes ${base.netYards} cubic yards of gravel, or ${base.orderYards} cu yd and about ${base.tons} tons once ${waste}% waste is added.`,
      `The form below starts at that size. The table under it shows other depths, and the tons use ${density} tons per cubic yard, a figure you can change if your yard quotes another.`,
    ],
    crumbs: [
      homeCrumb(),
      { name: "Gravel Calculator", path: "/gravel-calculator" },
      { name: `${L} x ${W} area` },
    ],
    formula: gravelPage.formula,
    example: {
      paragraphs: [
        `Area first: ${L} × ${W} = ${area(spec)} sq ft. At ${d} in the layer is ${area(spec)} × (${d} ÷ 12) = ${cubicFeet(spec, d)} cubic feet, which is ${base.netYards} cu yd after dividing by 27.`,
        `Add ${waste}% for settling and an uneven base and the order is ${base.orderYards} cu yd. At ${density} tons per cubic yard that is ${base.tons} tons. Many suppliers sell gravel by the ton, so that is the number to read to them.`,
        `Depth moves the order the most. At 6 in the same area needs ${six.orderYards} cu yd, about ${six.tons} tons. Wet stone weighs more than dry stone, so the scale ticket wins if it disagrees with this page.`,
      ],
    },
    faqs: [
      {
        question: `How many yards of gravel for a ${L}x${W} area?`,
        answer: `At ${d} in, ${base.netYards} cu yd net and ${base.orderYards} cu yd with ${waste}% waste. Set waste to 0 if the base is already level and compacted.`,
      },
      {
        question: `How many tons of gravel for a ${L}x${W} area?`,
        answer: `About ${base.tons} tons at ${d} in, using ${density} tons per cubic yard on the ${base.orderYards} cu yd order. Ask the supplier for the density of the stone you are buying and type it into the form.`,
      },
      {
        question: `How much gravel for a ${L}x${W} area 6 inches deep?`,
        answer: `${six.orderYards} cu yd with ${waste}% waste, about ${six.tons} tons. Thicker layers are often laid in lifts and compacted between them, which can settle the total further.`,
      },
      {
        question: `What is the square footage of a ${L}x${W} area?`,
        answer: `${area(spec)} sq ft. Each inch of depth on that area is ${yardsPerInch(spec)} cu yd before waste, which makes it easy to check a delivery against the depth you want.`,
      },
    ],
    related: [
      {
        href: "/gravel-calculator",
        title: "Gravel calculator",
        summary: "Any length, width, and depth, with the density left as a field.",
      },
      ...neighbors(gravelSpecs, index, gravelLinkFor),
    ],
    defaultNote: {
      before: `This ${L} by ${W} area starts at ${waste}% waste and ${density} tons per cubic yard, from a loose unit weight in the`,
      sourceName: gravelDensity.sourceName,
      sourceUrl: gravelDensity.sourceUrl,
      after: `, checked ${gravelDensity.lastVerified}. One 3/8 in sample is listed at 103.85 lb per cubic foot, about ${density} tons per cubic yard. Edit the density and the tons follow your number. The scale ticket wins if it disagrees.`,
    },
    table: {
      caption: `Gravel for a ${L} x ${W} ft area with ${waste}% waste at ${density} tons per cu yd`,
      headers: ["Depth", "Net cu yd", "Order cu yd", "Tons"],
      rows: depths.map((depth) => {
        const f = gravelFor(spec, depth);
        return [`${depth} in`, f.netYards, f.orderYards, f.tons];
      }),
    },
  };
}

function mulchFor(spec: SizeSpec, depthIn: number, bagCubicFeet = mulchBag2.value) {
  return mulchFigures({
    lengthFt: spec.lengthFt,
    widthFt: spec.widthFt,
    thicknessIn: depthIn,
    wastePercent: waste,
    bagCubicFeet,
  });
}

function mulchLinkFor(spec: SizeSpec): RelatedLink {
  const f = mulchFor(spec, spec.depthIn);
  return {
    href: `/mulch-calculator/${slug(spec)}`,
    title: `${spec.lengthFt} x ${spec.widthFt} mulch bed`,
    summary: `${f.bags} bags of 2 cu ft or ${f.orderYards} cu yd at ${spec.depthIn} in.`,
  };
}

function mulchSizePage(spec: SizeSpec, index: number): SizePage {
  const L = spec.lengthFt;
  const W = spec.widthFt;
  const d = spec.depthIn;
  const base = mulchFor(spec, d);
  const big = mulchFor(spec, d, mulchBag3.value);
  const two = mulchFor(spec, 2);
  const four = mulchFor(spec, 4);

  return {
    material: "mulch",
    slug: slug(spec),
    lengthFt: L,
    widthFt: W,
    depthIn: d,
    path: `/mulch-calculator/${slug(spec)}`,
    title: `Mulch for a ${L}x${W} Bed — Bags and Yards`,
    description: `How much mulch for a ${L} by ${W} bed? At ${d} in it is ${base.bags} bags of 2 cu ft or ${base.orderYards} cu yd with ${waste}% waste. Table for 2, 3, and 4 in.`,
    h1: `Mulch for a ${L} x ${W} Bed`,
    intro: [
      `A ${L} by ${W} ft ${spec.use} mulched ${d} in deep needs ${base.bags} bags of 2 cu ft, or ${base.orderYards} cubic yards in bulk, with ${waste}% waste included.`,
      "The form below starts at that size. The table under it compares depths and bag sizes, so you can see whether bulk or bags makes more sense.",
    ],
    crumbs: [
      homeCrumb(),
      { name: "Mulch Calculator", path: "/mulch-calculator" },
      { name: `${L} x ${W} bed` },
    ],
    formula: mulchPage.formula,
    example: {
      paragraphs: [
        `Area first: ${L} × ${W} = ${area(spec)} sq ft. At ${d} in the layer is ${area(spec)} × (${d} ÷ 12) = ${cubicFeet(spec, d)} cubic feet, or ${base.netYards} cu yd after dividing by 27.`,
        `With ${waste}% waste the order is ${base.orderYards} cu yd. Divided into ${mulchBag2.label}s and rounded up, that is ${base.bags} bags. In ${mulchBag3.label}s it is ${big.bags} bags.`,
        `Depth changes the count quickly. A 2 in top-up on this bed is ${two.bags} bags of 2 cu ft, while a 4 in layer is ${four.bags} bags. Fresh mulch settles, so a bed laid at ${d} in will sit lower after a few weeks.`,
      ],
    },
    faqs: [
      {
        question: `How many bags of mulch for a ${L}x${W} bed?`,
        answer: `At ${d} in, ${base.bags} bags of 2 cu ft or ${big.bags} bags of 3 cu ft, with ${waste}% waste. Check the volume printed on the bag and type it into the form if it differs.`,
      },
      {
        question: `How many yards of mulch for a ${L}x${W} bed?`,
        answer: `${base.netYards} cu yd net at ${d} in, and ${base.orderYards} cu yd with ${waste}% waste. Bulk suppliers sell by the yard, so this is the figure to ask for.`,
      },
      {
        question: `How much mulch to top up a ${L}x${W} bed by 2 inches?`,
        answer: `${two.orderYards} cu yd with waste, which is ${two.bags} bags of 2 cu ft. A top-up over old mulch usually needs less than a fresh bed laid on bare soil.`,
      },
      {
        question: `What is the square footage of a ${L}x${W} bed?`,
        answer: `${area(spec)} sq ft. Each inch of depth on that area is ${yardsPerInch(spec)} cu yd before waste, so you can scale the order to any depth in your head.`,
      },
    ],
    related: [
      {
        href: "/mulch-calculator",
        title: "Mulch calculator",
        summary: "Any bed size, with the bag volume left as a field you can change.",
      },
      ...neighbors(mulchSpecs, index, mulchLinkFor),
    ],
    defaultNote: {
      before: `This ${L} by ${W} bed starts at ${waste}% waste and a ${mulchBag2.label}, the dry volume listed for`,
      sourceName: mulchBag2.sourceName,
      sourceUrl: mulchBag2.sourceUrl,
      after: `, checked ${mulchBag2.lastVerified}. That listing also says one bag covers 8 sq ft at 3 in, which is the same 2 cu ft. The 1.5 and 3 cu ft options are other volumes printed on bags. Edit the field and the result uses your number. The bag wins.`,
    },
    table: {
      caption: `Mulch for a ${L} x ${W} ft bed with ${waste}% waste`,
      headers: ["Depth", "Order cu yd", "2 cu ft bags", "3 cu ft bags"],
      rows: [2, 3, 4].map((depth) => {
        const f = mulchFor(spec, depth);
        const g = mulchFor(spec, depth, mulchBag3.value);
        return [`${depth} in`, f.orderYards, f.bags, g.bags];
      }),
    },
  };
}

export const concreteSizePages = concreteSpecs.map(concretePage);
export const gravelSizePages = gravelSpecs.map(gravelSizePage);
export const mulchSizePages = mulchSpecs.map(mulchSizePage);

export const sizePages: readonly SizePage[] = [...concreteSizePages, ...gravelSizePages, ...mulchSizePages];

export function sizePage(material: SizeMaterial, size: string): SizePage | undefined {
  return sizePages.find((page) => page.material === material && page.slug === size);
}

/** Links for the "Common sizes" list on each parent calculator page. */
export const concreteSizeLinks = concreteSpecs.map(concreteLinkFor);
export const gravelSizeLinks = gravelSpecs.map(gravelLinkFor);
export const mulchSizeLinks = mulchSpecs.map(mulchLinkFor);
