import toolsData from "@/data/tools.json";

export interface ToolPricing {
  free: boolean;
  [key: string]: number | boolean | null;
}

export interface Tool {
  slug: string;
  name: string;
  category: string;
  subcategories: string[];
  description: string;
  pricing: ToolPricing;
  features: string[];
  bestFor: string[];
  affiliateUrl: string;
  affiliateProgram: string;
  logoUrl?: string;
  rating: number;
  pros: string[];
  cons: string[];
  alternatives: string[];
  lastUpdated: string;
}

const tools: Tool[] = toolsData as unknown as Tool[];

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolBySlug(slug: string): Tool | null {
  return tools.find((t) => t.slug === slug) ?? null;
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getToolsByRole(role: string): Tool[] {
  return tools.filter((t) => t.bestFor.includes(role));
}

export function getAllCategories(): string[] {
  return [...new Set(tools.map((t) => t.category))];
}

export function getAllRoles(): string[] {
  return [...new Set(tools.flatMap((t) => t.bestFor))];
}

/**
 * Parse a compare route param like "notion-vs-clickup" into two slugs.
 * Returns null if the format is invalid or either tool is not found.
 */
export function parseCompareParam(param: string): [Tool, Tool] | null {
  const vsIndex = param.indexOf("-vs-");
  if (vsIndex === -1) return null;
  const slugA = param.slice(0, vsIndex);
  const slugB = param.slice(vsIndex + 4);
  const toolA = getToolBySlug(slugA);
  const toolB = getToolBySlug(slugB);
  if (!toolA || !toolB) return null;
  return [toolA, toolB];
}

/**
 * Generate all valid compare param strings from the tools list.
 * Produces every ordered pair (A, B) where A !== B so both /a-vs-b routes exist.
 */
export function getAllComparePairs(): string[] {
  const pairs: string[] = [];
  for (let i = 0; i < tools.length; i++) {
    for (let j = 0; j < tools.length; j++) {
      if (i !== j) {
        pairs.push(`${tools[i].slug}-vs-${tools[j].slug}`);
      }
    }
  }
  return pairs;
}

/**
 * Parse a best-for route param like "ai-writing-for-developers" into category + role.
 * Returns null if the format is invalid or no tools match.
 */
export function parseBestForParam(param: string): {
  category: string;
  role: string;
  tools: Tool[];
} | null {
  const forIndex = param.lastIndexOf("-for-");
  if (forIndex === -1) return null;
  const category = param.slice(0, forIndex);
  const role = param.slice(forIndex + 5);
  const matched = tools.filter(
    (t) => t.category === category && t.bestFor.includes(role)
  );
  if (matched.length === 0) return null;
  return { category, role, tools: matched };
}

/**
 * Generate all valid best-for param strings from the tools list.
 */
export function getAllBestForParams(): string[] {
  const params = new Set<string>();
  for (const tool of tools) {
    for (const role of tool.bestFor) {
      params.add(`${tool.category}-for-${role}`);
    }
  }
  return [...params];
}

/** Format a slug like "project-management" -> "Project Management" */
export function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Get the lowest paid price for a tool, or "Free" if only free tier exists. */
export function getStartingPrice(pricing: ToolPricing): string {
  if (pricing.starter !== null) return `$${pricing.starter}/mo`;
  if (pricing.pro !== null) return `$${pricing.pro}/mo`;
  if (pricing.free) return "Free";
  return "Contact sales";
}
