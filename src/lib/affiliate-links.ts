// Central affiliate link registry.
// Add new mappings here as slug -> URL. These override empty affiliateUrl fields in tools.json.
// TODO: Add Beehiiv partner URL once retrieved from the affiliate dashboard.

const affiliateLinks: Record<string, string> = {
  make: "https://www.make.com/?pc=aitoolbreakdown",
};

export function getAffiliateLink(toolSlug: string): string | null {
  return affiliateLinks[toolSlug] ?? null;
}
