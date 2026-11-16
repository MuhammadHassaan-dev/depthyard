import type { Metadata } from "next";
import type { Crumb } from "@/content/pages";
import { site } from "./site";

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      title: input.title,
      description: input.description,
      url: input.path,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.name}. Concrete, gravel, mulch, and paint quantities.`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: ["/opengraph-image"],
    },
  };
}

function absolute(path: string): string {
  return new URL(path, site.url).toString();
}

export function breadcrumbList(crumbs: readonly Crumb[], currentPath: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path ?? currentPath),
    })),
  };
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    ...breadcrumbList(crumbs, currentPath),
  };
}

export function calculatorJsonLd(input: {
  path: string;
  h1: string;
  description: string;
  crumbs: readonly Crumb[];
  faqs: readonly { question: string; answer: string }[];
}) {
  const pageUrl = absolute(input.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...breadcrumbList(input.crumbs, input.path),
        "@id": `${pageUrl}#breadcrumb`,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: input.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: input.h1,
        description: input.description,
        url: pageUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}
