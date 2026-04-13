import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Weekly AI tool roundup - the best tools, tips, and deals delivered to your inbox.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
      <p className="mt-4 text-lg text-secondary">
        Every week, we send one email with the most useful AI tools, tips, and
        deals we found. No spam, no fluff - just what actually helps you work
        better.
      </p>

      <div className="mt-4 text-secondary">
        <p className="font-medium">What you get:</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>- Tool spotlight: one tool, deeply reviewed</li>
          <li>- Productivity tip of the week</li>
          <li>- New tool launches worth knowing about</li>
          <li>- Deals and discounts (when they are real, not manufactured)</li>
          <li>- One product recommendation from our digital store</li>
        </ul>
      </div>

      <div className="mt-8">
        <NewsletterSignup />
      </div>
    </div>
  );
}
