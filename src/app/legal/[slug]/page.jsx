import { notFound } from "next/navigation";
import Link from "next/link";
import { LEGAL, LEGAL_LINKS, SITE } from "@/lib/legalContent";

export function generateStaticParams() {
  return Object.keys(LEGAL).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const doc = LEGAL[params.slug];
  if (!doc) return {};
  const url = `${SITE.url}/legal/${params.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/legal/${params.slug}` },
    openGraph: {
      title: `${doc.title} | ${SITE.name}`,
      description: doc.description,
      url,
      type: "article",
    },
  };
}

export default function LegalPage({ params }) {
  const doc = LEGAL[params.slug];
  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 max-md:py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / <span className="text-foreground">{doc.title}</span>
      </nav>
      <h1 className="text-4xl max-md:text-3xl font-bold tracking-tight">
        {doc.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {SITE.updated}
      </p>
      <div className="mt-8 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            {section.body.map((paragraph, index) => (
              <p
                key={index}
                className="mt-3 leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-12 border-t pt-6">
        <h3 className="mb-3 text-sm font-semibold">More pages</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {LEGAL_LINKS.map((link) => (
            <li key={link.slug}>
              <Link href={`/legal/${link.slug}`} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
