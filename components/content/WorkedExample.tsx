export function WorkedExample({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <section aria-labelledby="example-heading">
      <h2 id="example-heading" className="font-serif text-2xl text-ink">
        Worked example
      </h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-ink">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
