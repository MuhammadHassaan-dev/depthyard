"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Requests an ad for this slot each time it mounts, so client-side
 * navigation fills new slots too. Pushes queue until the AdSense script loads.
 */
export function AdUnit({ client, slot }: { client: string; slot: string }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // A blocked or failed ad leaves the reserved space empty.
    }
  }, []);

  return (
    <ins
      ref={ref}
      className="adsbygoogle mt-2 block"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
