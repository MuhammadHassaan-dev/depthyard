import { adsenseClient, adsenseSlot } from "@/lib/site";

/**
 * Sits under the tool, or beside the prose on a large screen.
 * It is never rendered next to an input or inside the result.
 * With no client id or no ad unit slot, it is absent and takes no space.
 */
export function AdSlot({ placement }: { placement: "below" | "rail" }) {
  const client = adsenseClient();
  const slot = adsenseSlot();
  if (!client || !slot) return null;

  const reserved = placement === "rail" ? "hidden min-h-[600px] lg:block" : "min-h-[280px]";

  return (
    <aside aria-label="Advertisement" className={placement === "below" ? "mx-auto mt-8 max-w-5xl" : undefined}>
      <div className={`${reserved} rounded-xl border border-dashed border-line bg-field p-3`}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Advertisement</p>
        {slot ? (
          <>
            <ins
              className="adsbygoogle mt-2 block"
              style={{ display: "block" }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});",
              }}
            />
          </>
        ) : null}
      </div>
    </aside>
  );
}
