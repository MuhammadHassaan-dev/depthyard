export type DefaultValue = {
  id: string;
  label: string;
  value: number;
  unit: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  note: string;
};

const verifiedOn = "2026-11-12";

const quikreteSheet = "https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf";
const quikreteName = "QUIKRETE Concrete Mix No. 1101 data sheet";

export const concreteBag80: DefaultValue = {
  id: "concrete-bag-80",
  label: "80 lb bag",
  value: 0.6,
  unit: "cu ft",
  sourceName: quikreteName,
  sourceUrl: quikreteSheet,
  lastVerified: verifiedOn,
  note: "The data sheet says an 80 lb bag yields approximately 0.60 cu ft. The bag you buy wins if it prints a different yield.",
};

export const concreteBag60: DefaultValue = {
  id: "concrete-bag-60",
  label: "60 lb bag",
  value: 0.45,
  unit: "cu ft",
  sourceName: quikreteName,
  sourceUrl: quikreteSheet,
  lastVerified: verifiedOn,
  note: "The data sheet says a 60 lb bag yields approximately 0.45 cu ft. The bag you buy wins if it prints a different yield.",
};

export const concreteBag40: DefaultValue = {
  id: "concrete-bag-40",
  label: "40 lb bag",
  value: 0.3,
  unit: "cu ft",
  sourceName: quikreteName,
  sourceUrl: quikreteSheet,
  lastVerified: verifiedOn,
  note: "The data sheet says a 40 lb bag yields approximately 0.30 cu ft. The bag you buy wins if it prints a different yield.",
};

export const concreteBagOptions = [concreteBag40, concreteBag60, concreteBag80];

export const wasteDefault: DefaultValue = {
  id: "waste",
  label: "Waste",
  value: 10,
  unit: "%",
  sourceName: "Depthyard planning default",
  sourceUrl: "/about",
  lastVerified: verifiedOn,
  note: "Waste covers the visitor's subgrade, spillage, and forms. It is not a code requirement. Zero is allowed.",
};

export const gravelDensity: DefaultValue = {
  id: "gravel-density",
  label: "Gravel density",
  value: 1.4,
  unit: "ton per cu yd",
  sourceName: "Rhode Island DOT 2017 coarse aggregate report, loose unit weight by AASHTO T 19",
  sourceUrl: "https://www.dot.ri.gov/documents/doingbusiness/materials/coarse_aggregates_2017.pdf",
  lastVerified: verifiedOn,
  note: "One listed loose unit weight is 103.85 lb per cubic foot for a 3/8 in sample, about 1.40 tons per cubic yard. Wet stone and other sizes differ. The scale ticket wins.",
};

export const mulchBag2: DefaultValue = {
  id: "mulch-bag-2",
  label: "2 cu ft bag",
  value: 2,
  unit: "cu ft",
  sourceName: "Vigoro 2 cu. ft. premium red wood mulch, listed bag capacity",
  sourceUrl: "https://www.homedepot.com/p/Vigoro-2-cu-ft-Bagged-Premium-Red-Wood-Mulch-480978/205606416",
  lastVerified: verifiedOn,
  note: "The listing gives a dry volume of 2 cu ft and coverage of 8 sq ft at 3 in, which is the same 2 cu ft. The bag wins if it prints another volume.",
};

export const mulchBag15: DefaultValue = {
  id: "mulch-bag-1-5",
  label: "1.5 cu ft bag",
  value: 1.5,
  unit: "cu ft",
  sourceName: "Printed bag volume",
  sourceUrl: "/mulch-calculator",
  lastVerified: verifiedOn,
  note: "1.5 cu ft is a common volume printed on mulch bags. Match the field to the bag in your hand.",
};

export const mulchBag3: DefaultValue = {
  id: "mulch-bag-3",
  label: "3 cu ft bag",
  value: 3,
  unit: "cu ft",
  sourceName: "Printed bag volume",
  sourceUrl: "/mulch-calculator",
  lastVerified: verifiedOn,
  note: "3 cu ft is a common volume printed on mulch bags. Match the field to the bag in your hand.",
};

export const mulchBagOptions = [mulchBag15, mulchBag2, mulchBag3];

export const paintCoverage: DefaultValue = {
  id: "paint-coverage",
  label: "Paint coverage",
  value: 350,
  unit: "sq ft per gallon",
  sourceName: "Sherwin-Williams ProMar 200 Zero VOC Interior Latex product data sheet",
  sourceUrl: "https://www.sherwin-williams.com/document/PDS/en/035777433768/",
  lastVerified: verifiedOn,
  note: "The data sheet prints 350–400 sq ft per gallon at 4 mils wet on smooth surfaces. This field starts at 350, the low end of that range. The can wins.",
};

export const paintCoats: DefaultValue = {
  id: "paint-coats",
  label: "Coats",
  value: 2,
  unit: "coats",
  sourceName: "Sherwin-Williams Duration Home interior latex product data sheet",
  sourceUrl: "https://www.sherwin-williams.com/document/PDS/en/035777440223",
  lastVerified: verifiedOn,
  note: "Interior latex data sheets specify two coats for a complete job. One coat is a real job, and the field can be changed.",
};
