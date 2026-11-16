export function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-stage-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-stage-ink">{value}</dd>
    </div>
  );
}
