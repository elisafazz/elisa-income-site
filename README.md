# AI Tool Stack (elisa-income-site)

Honest AI and SaaS tool review site. Next.js 16 + Tailwind CSS + TypeScript on Vercel.

## Stack
- Next.js 16 (App Router, Turbopack)
- Tailwind CSS 4
- TypeScript
- Vercel auto-deploy from main

## Development
```bash
npm run dev     # localhost:3000
npm run build   # production build check
```

## Content
Blog posts go in `src/content/blog/` as markdown files with frontmatter:
```markdown
---
title: "Article Title"
description: "Short description for SEO"
date: "2026-04-09"
author: "AI Tool Stack"
category: "comparison"
tags: ["AI writing", "Jasper", "Copy.ai"]
affiliatePrograms: ["Jasper", "Copy.ai"]
---

Article content here...
```

Products go in `src/content/products/` with frontmatter:
```markdown
---
name: "Product Name"
description: "What it does"
price: "$29"
platforms: ["Gumroad", "Etsy"]
type: "Notion Template"
features: ["Feature 1", "Feature 2"]
buyUrl: "https://gumroad.com/..."
---
```

## Routes
- `/` - Homepage with latest articles
- `/blog` - Blog index
- `/blog/[slug]` - Individual article
- `/products` - Digital product showcase
- `/newsletter` - Newsletter signup
- `/about` - About page
- `/affiliate-disclosure` - FTC-compliant affiliate disclosure

## Deployment
Push to main triggers Vercel auto-deploy. Always run `npm run build` before pushing.
