import type { SizeTable as SizeTableData } from "@/content/sizes";

export function SizeTable({ table }: { table: SizeTableData }) {
  return (
    <section aria-labelledby="size-table-heading" className="mt-8">
      <h2 id="size-table-heading" className="font-serif text-2xl text-ink">
        By depth
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-field">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <caption className="px-4 pt-3 text-left text-sm text-muted">{table.caption}</caption>
          <thead>
            <tr className="border-b border-line">
              {table.headers.map((header) => (
                <th key={header} scope="col" className="px-4 py-3 font-semibold text-ink">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="border-b border-line last:border-b-0">
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={index} scope="row" className="px-4 py-3 font-semibold text-ink">
                      {cell}
                    </th>
                  ) : (
                    <td key={index} className="px-4 py-3 tabular-nums text-ink">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
