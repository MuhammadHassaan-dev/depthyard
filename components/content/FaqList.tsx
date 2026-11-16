import type { FaqItem } from "@/content/pages";

export function FaqList({ faqs }: { faqs: readonly FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-serif text-2xl text-ink">
        Questions
      </h2>
      <div className="mt-2 divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 py-3 text-base font-semibold text-ink">
              {faq.question}
              <span aria-hidden="true" className="text-muted group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="hidden text-muted group-open:inline">
                −
              </span>
            </summary>
            <p className="pb-4 text-base leading-7 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
