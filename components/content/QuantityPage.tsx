import type { ReactNode } from "react";
import type { CalculatorPage } from "@/content/pages";
import { AdSlot } from "@/components/layout/AdSlot";
import { calculatorJsonLd } from "@/lib/seo";
import { adsenseClient, adsenseSlot } from "@/lib/site";
import { DefaultNote } from "./DefaultNote";
import { FaqList } from "./FaqList";
import { FormulaBlock } from "./FormulaBlock";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";
import { RelatedLinks } from "./RelatedLinks";
import { WorkedExample } from "./WorkedExample";

export function QuantityPage({
  page,
  children,
  after,
}: {
  page: CalculatorPage;
  children: ReactNode;
  /** Extra sections printed after the related tools, such as a list of common sizes. */
  after?: ReactNode;
}) {
  const ads = Boolean(adsenseClient() && adsenseSlot());

  return (
    <article className="shell py-8 sm:py-12">
      <JsonLd data={calculatorJsonLd(page)} />
      <div className="mx-auto max-w-3xl lg:mx-0 lg:max-w-none">
        <PageHero page={page} />
      </div>
      <div className="mt-8">{children}</div>
      <AdSlot placement="below" />
      <div
        className={
          ads
            ? "mt-12 xl:grid xl:grid-cols-[minmax(0,65ch)_18rem] xl:justify-center xl:gap-12"
            : "mx-auto mt-12 max-w-[65ch]"
        }
      >
        <div className="space-y-12">
          <FormulaBlock formula={page.formula} />
          <WorkedExample paragraphs={page.example.paragraphs} />
          <FaqList faqs={page.faqs} />
          <RelatedLinks links={page.related} />
          {after}
          <DefaultNote note={page.defaultNote} />
        </div>
        {ads ? <AdSlot placement="rail" /> : null}
      </div>
    </article>
  );
}
