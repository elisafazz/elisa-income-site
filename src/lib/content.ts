import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: "comparison" | "how-to" | "review" | "listicle" | "guide";
  tags: string[];
  affiliatePrograms: string[];
  content: string;
}

export interface Product {
  slug: string;
  name: string;
  description: string;
  price: string;
  platforms: string[];
  type: string;
  features: string[];
  buyUrl: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const PRODUCTS_DIR = path.join(process.cwd(), "src/content/products");

function parseFrontmatter(fileContent: string): {
  metadata: Record<string, string | string[]>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);
  if (!match) return { metadata: {}, content: fileContent };

  const frontmatterBlock = match[1];
  const content = match[2];
  const metadata: Record<string, string | string[]> = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      metadata[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
    } else {
      metadata[key] = value.replace(/^['"]|['"]$/g, "");
    }
  });

  return { metadata, content };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { metadata, content } = parseFrontmatter(raw);
    return {
      slug: file.replace(".md", ""),
      title: (metadata.title as string) || "",
      description: (metadata.description as string) || "",
      date: (metadata.date as string) || "",
      author: (metadata.author as string) || "AI Tool Breakdown",
      category: (metadata.category as BlogPost["category"]) || "guide",
      tags: (metadata.tags as string[]) || [],
      affiliatePrograms: (metadata.affiliatePrograms as string[]) || [],
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { metadata, content } = parseFrontmatter(raw);
  return {
    slug,
    title: (metadata.title as string) || "",
    description: (metadata.description as string) || "",
    date: (metadata.date as string) || "",
    author: (metadata.author as string) || "AI Tool Breakdown",
    category: (metadata.category as BlogPost["category"]) || "guide",
    tags: (metadata.tags as string[]) || [],
    affiliatePrograms: (metadata.affiliatePrograms as string[]) || [],
    content,
  };
}

export function getProductBySlug(slug: string): Product | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { metadata } = parseFrontmatter(raw);
  return {
    slug,
    name: (metadata.name as string) || "",
    description: (metadata.description as string) || "",
    price: (metadata.price as string) || "",
    platforms: (metadata.platforms as string[]) || [],
    type: (metadata.type as string) || "",
    features: (metadata.features as string[]) || [],
    buyUrl: (metadata.buyUrl as string) || "#",
  };
}

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
    const { metadata, content } = parseFrontmatter(raw);
    return {
      slug: file.replace(".md", ""),
      name: (metadata.name as string) || "",
      description: (metadata.description as string) || "",
      price: (metadata.price as string) || "",
      platforms: (metadata.platforms as string[]) || [],
      type: (metadata.type as string) || "",
      features: (metadata.features as string[]) || [],
      buyUrl: (metadata.buyUrl as string) || "#",
    };
  });
}
