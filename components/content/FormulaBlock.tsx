import type { CalculatorPage } from "@/content/pages";

export function FormulaBlock({ formula }: { formula: CalculatorPage["formula"] }) {
  return (
    <section aria-labelledby="formula-heading">
      <h2 id="formula-heading" className="font-serif text-2xl text-ink">
        Formula
      </h2>
      <p className="formula-strip mt-4 text-ink sm:text-base">{formula.expression}</p>
      <dl className="mt-5 space-y-4">
        {formula.symbols.map((symbol) => (
          <div key={symbol.symbol}>
            <dt className="font-mono text-sm font-semibold text-ink">{symbol.symbol}</dt>
            <dd className="mt-1 text-base leading-7 text-muted">{symbol.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
