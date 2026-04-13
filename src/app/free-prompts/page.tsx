import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Free Claude Prompt Library - 50+ AI Prompts",
  description:
    "Download 50+ tested Claude AI prompt templates for free. Blog content, email marketing, social media, SEO, sales copy, and more. Copy-paste ready.",
  openGraph: {
    title: "Free Claude Prompt Library - 50+ AI Prompts",
    description:
      "Download 50+ tested Claude AI prompt templates for free. Copy-paste ready prompts for content creators, marketers, and solopreneurs.",
  },
};

const categories = [
  { name: "Blog Content", count: 8, examples: "Long-form articles, listicles, how-to guides, comparison posts" },
  { name: "Email Marketing", count: 7, examples: "Welcome sequences, campaigns, cold outreach, newsletters" },
  { name: "Social Media", count: 8, examples: "X threads, LinkedIn posts, Instagram captions, repurposing" },
  { name: "Sales Copy", count: 6, examples: "Landing pages, product descriptions, pricing pages" },
  { name: "SEO", count: 5, examples: "Meta descriptions, FAQ content, keyword clustering" },
  { name: "Business Ops", count: 6, examples: "Meeting summaries, SOPs, competitive analysis" },
  { name: "Editing", count: 5, examples: "Tone adjustment, simplification, brand voice matching" },
  { name: "Strategy", count: 5, examples: "Content calendars, audience analysis, competitor teardowns" },
];

export default function FreePromptsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
          Free Download
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground font-heading">
          50+ Claude AI Prompt Templates
        </h1>
        <p className="mt-4 text-lg text-secondary max-w-xl mx-auto">
          Stop writing mediocre prompts. Get 50+ tested, copy-paste-ready templates
          organized by use case - with variables, context instructions, and real output examples.
        </p>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">{cat.name}</h3>
              <span className="text-sm text-accent">{cat.count} prompts</span>
            </div>
            <p className="mt-1 text-sm text-secondary">{cat.examples}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Every prompt includes:
        </h2>
        <ul className="mt-3 space-y-2 text-secondary">
          <li className="flex gap-2">
            <span className="text-accent">-</span>
            Copy-paste template with [VARIABLE] placeholders
          </li>
          <li className="flex gap-2">
            <span className="text-accent">-</span>
            Variable guide explaining what to fill in
          </li>
          <li className="flex gap-2">
            <span className="text-accent">-</span>
            Context instructions for better results
          </li>
          <li className="flex gap-2">
            <span className="text-accent">-</span>
            Real example output so you know what to expect
          </li>
          <li className="flex gap-2">
            <span className="text-accent">-</span>
            Customization tips for different industries
          </li>
        </ul>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-foreground font-heading">
          Get the full library free
        </h2>
        <p className="mt-2 text-secondary">
          Subscribe to the AI Tool Breakdown newsletter and get instant access.
          One email per week with the best AI tools, tips, and deals.
        </p>
      </div>

      <div className="mt-6">
        <NewsletterSignup />
      </div>

      <p className="mt-6 text-center text-xs text-secondary">
        After subscribing, you will receive the prompt library PDF in your welcome email.
        Unsubscribe anytime.
      </p>
    </div>
  );
}
