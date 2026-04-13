import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How affiliate links work on AI Tool Breakdown.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">
        Affiliate Disclosure
      </h1>

      <div className="mt-8 space-y-4 text-secondary">
        <p>
          AI Tool Breakdown is reader-supported. Some of the links on this site are
          affiliate links, meaning we may earn a commission if you click through
          and make a purchase. This comes at no additional cost to you.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          What this means
        </h2>
        <p>
          When you click an affiliate link and purchase a product or service, the
          company pays us a referral fee. This helps us keep the site running and
          continue producing free content.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          What this does not mean
        </h2>
        <p>
          Affiliate relationships never influence our editorial content. We do
          not accept paid placements, and we do not adjust our reviews or
          rankings based on commission rates. If a tool with a high commission is
          not good, we will say so. If a tool with no affiliate program is the
          best option, we will recommend it anyway.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          How to identify affiliate links
        </h2>
        <p>
          Articles containing affiliate links include a disclosure notice at the
          top. We clearly mark which content is editorially independent.
        </p>

        <p className="mt-6 text-sm text-tertiary">
          Questions? Reach out via the contact info on our About page.
        </p>
      </div>
    </div>
  );
}
