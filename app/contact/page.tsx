import { TrustPage } from "@/components/content/TrustPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `Contact — ${site.name}`,
  description: `Contact the publisher of ${site.name}. Email is listed here, and a mailing address is shown once it is confirmed.`,
  path: "/contact",
});

export default function ContactPage() {
  const address = site.mailingAddress;

  return (
    <TrustPage
      path="/contact"
      title="Contact"
      lede="Write to the publisher about a default, a correction, or the pages themselves."
    >
      <p>
        Email{" "}
        <a className="underline decoration-line underline-offset-4" href={`mailto:${site.contactEmail}`}>
          {site.contactEmail}
        </a>
        . There is no account to sign in to, and the calculator does not keep a copy of what you typed.
      </p>
      {address.length > 0 ? (
        <address className="not-italic">
          {address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ) : (
        <p>
          A mailing address will be listed here when the publisher confirms one. Until then, email is the contact. Do not treat a missing street as a reason to invent one.
        </p>
      )}
    </TrustPage>
  );
}
