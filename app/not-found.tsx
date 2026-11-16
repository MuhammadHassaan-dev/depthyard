import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell max-w-[65ch] py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">That page is not on Depthyard</h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        The calculators are listed from the home page. There is no city version of a formula.
      </p>
      <Link href="/" className="mt-6 inline-flex h-12 items-center font-semibold underline-offset-4 hover:underline">
        Back home
      </Link>
    </div>
  );
}
