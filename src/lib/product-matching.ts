import { getAllProducts, type Product } from "./content";

/**
 * Maps product slugs to the tool categories and roles they're relevant for.
 * When a page has a matching category or role, the product appears as a CTA.
 */
const PRODUCT_CATEGORY_MAP: Record<
  string,
  { categories: string[]; roles: string[] }
> = {
  "claude-prompt-library": {
    categories: [
      "ai-writing",
      "ai-assistant",
      "ai-chatbot",
      "content-creation",
      "copywriting",
    ],
    roles: [
      "content-creators",
      "bloggers",
      "marketers",
      "solopreneurs",
      "freelancers",
    ],
  },
  "ai-tool-decision-kit": {
    // Meta-product: relevant to anyone evaluating tools
    categories: [
      "ai-writing",
      "ai-assistant",
      "ai-chatbot",
      "project-management",
      "crm",
      "automation",
      "seo",
      "design",
      "video",
      "email-marketing",
      "social-media",
      "content-creation",
      "copywriting",
      "analytics",
      "customer-support",
      "hr",
      "sales",
      "accounting",
    ],
    roles: [
      "solopreneurs",
      "startup-founders",
      "developers",
      "marketers",
      "freelancers",
      "managers",
    ],
  },
  "ai-stacks-content-creator": {
    categories: [
      "content-creation",
      "ai-writing",
      "social-media",
      "video",
      "design",
      "seo",
      "copywriting",
    ],
    roles: ["content-creators", "bloggers", "freelancers", "solopreneurs"],
  },
};

/**
 * Returns 0-2 products relevant to a page's category and roles.
 * Products are scored by how many category/role matches they have.
 */
export function getRelevantProducts(
  category: string,
  roles: string[] = []
): Product[] {
  const products = getAllProducts();
  if (products.length === 0) return [];

  const scored = products
    .map((product) => {
      const map = PRODUCT_CATEGORY_MAP[product.slug];
      if (!map) return { product, score: 0 };

      let score = 0;
      if (map.categories.includes(category)) score += 2;
      for (const role of roles) {
        if (map.roles.includes(role)) score += 1;
      }
      return { product, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 2).map((s) => s.product);
}
