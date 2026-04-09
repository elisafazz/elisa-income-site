import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About AI Tool Stack - who we are, how we review tools, and our commitment to honest content.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">About AI Tool Stack</h1>

      <div className="mt-8 space-y-6 text-gray-600">
        <p>
          AI Tool Stack is an independent review site for AI and SaaS tools. We
          write honest, in-depth comparisons to help you pick the right tools for
          your workflow without wading through vendor marketing.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">How we review</h2>
        <p>
          Every tool we review is actually tested. We compare features,
          pricing (at real team sizes, not just the cheapest tier), and
          usability. We include genuine pros and cons. If a tool is not great, we
          say so.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">
          How we make money
        </h2>
        <p>
          Some articles contain affiliate links. If you purchase a tool through
          our links, we may earn a commission at no extra cost to you. This
          never influences our reviews - we recommend tools based on quality,
          not commission rates. See our{" "}
          <a href="/affiliate-disclosure" className="text-blue-600 hover:underline">
            affiliate disclosure
          </a>{" "}
          for full details.
        </p>
        <p>
          We also sell digital products (templates, guides, prompt packs) that
          complement our reviews. These are things we would use ourselves.
        </p>

        <h2 className="text-xl font-semibold text-gray-900">What we avoid</h2>
        <ul className="list-none space-y-1">
          <li>- Clickbait or misleading headlines</li>
          <li>- Fake urgency or scarcity tactics</li>
          <li>- Paid reviews disguised as editorial content</li>
          <li>- Exaggerated claims about any tool</li>
        </ul>
      </div>
    </div>
  );
}
