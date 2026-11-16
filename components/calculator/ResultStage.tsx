import { ResultStat } from "./ResultStat";

export function ResultStage({
  labelId,
  error,
  emphasis,
  secondary,
  assumption,
}: {
  labelId: string;
  error?: string;
  emphasis?: { label: string; value: string; caption: string };
  secondary: { label: string; value: string }[];
  assumption?: string;
}) {
  return (
    <section aria-live="polite" aria-labelledby={labelId} className="overflow-hidden rounded-3xl border border-white/10 bg-stage px-5 py-6 sm:px-7 sm:py-8">
      <h2 id={labelId} className="sr-only">
        Result
      </h2>
      {error || !emphasis ? (
        <p className="text-2xl font-medium leading-snug text-stage-ink">{error}</p>
      ) : (
        <>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">{emphasis.label}</p>
          <p
            key={emphasis.value}
            data-result={emphasis.value}
            className="result-figure mt-3 font-sans text-[4.25rem] font-semibold leading-none tracking-tight tabular-nums text-stage-ink sm:text-[5.25rem]"
          >
            {emphasis.value}
          </p>
          <p className="mt-3 max-w-[28ch] text-sm leading-6 text-stage-muted">{emphasis.caption}</p>
          {secondary.length > 0 ? (
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/15 pt-5">
              {secondary.map((stat) => (
                <ResultStat key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </dl>
          ) : null}
          {assumption ? <p className="mt-5 text-sm leading-6 text-stage-muted">{assumption}</p> : null}
        </>
      )}
    </section>
  );
}
