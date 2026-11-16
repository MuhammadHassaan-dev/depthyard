import Link from "next/link";
import type { DefaultNote as DefaultNoteContent } from "@/content/pages";

export function DefaultNote({ note }: { note: DefaultNoteContent }) {
  const className = "underline decoration-line underline-offset-4";
  const external = note.sourceUrl.startsWith("http");

  return (
    <section aria-labelledby="defaults-heading">
      <h2 id="defaults-heading" className="font-serif text-2xl text-ink">
        Starting values
      </h2>
      <p className="mt-4 text-base leading-7 text-muted">
        {note.before}{" "}
        {external ? (
          <a href={note.sourceUrl} className={className} rel="noreferrer">
            {note.sourceName}
          </a>
        ) : (
          <Link href={note.sourceUrl} className={className}>
            {note.sourceName}
          </Link>
        )}
        {note.after}
      </p>
    </section>
  );
}
