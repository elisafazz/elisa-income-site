import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://aitoolbreakdown.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/compare/", "/best/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
