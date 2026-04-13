import Link from "next/link";
import { formatSlug } from "@/lib/tools";

type RelatedContentProps = {
  category: string;
  roles?: string[];
};

export function RelatedContent({ category, roles }: RelatedContentProps) {
  const categoryLabel = formatSlug(category);

  return (
    <section className="mt-8 rounded-lg border border-border bg-surface p-6">
      <h2 className="text-base font-semibold text-foreground">
        Explore more {categoryLabel} tools
      </h2>
      <div className="mt-3 flex flex-wrap gap-3">
        <Link
          href={`/tools#${category}`}
          className="text-sm text-accent hover:text-accent-hover"
        >
          All {categoryLabel} tools
        </Link>
        {roles?.slice(0, 5).map((role) => (
          <Link
            key={role}
            href={`/best/${category}-for-${role}`}
            className="text-sm text-accent hover:text-accent-hover"
          >
            Best {categoryLabel} for {formatSlug(role)}s
          </Link>
        ))}
      </div>
    </section>
  );
}
