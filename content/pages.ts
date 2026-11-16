export type Crumb = { name: string; path?: string };

export type FormulaSymbol = { symbol: string; definition: string };

export type FaqItem = { question: string; answer: string };

export type RelatedLink = { href: string; title: string; summary: string };

export type DefaultNote = {
  before: string;
  sourceName: string;
  sourceUrl: string;
  after: string;
};

export type CalculatorPage = {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: readonly [string, string];
  crumbs: readonly Crumb[];
  formula: { expression: string; symbols: readonly FormulaSymbol[] };
  example: { paragraphs: readonly string[] };
  faqs: readonly [FaqItem, FaqItem, FaqItem, FaqItem];
  related: readonly RelatedLink[];
  defaultNote: DefaultNote;
};

export function pageWords(page: CalculatorPage): number {
  const parts = [
    page.intro[0],
    page.intro[1],
    page.formula.expression,
    ...page.formula.symbols.flatMap((symbol) => [symbol.symbol, symbol.definition]),
    ...page.example.paragraphs,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    page.defaultNote.before,
    page.defaultNote.sourceName,
    page.defaultNote.after,
  ];
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function homeCrumb(): Crumb {
  return { name: "Home", path: "/" };
}
