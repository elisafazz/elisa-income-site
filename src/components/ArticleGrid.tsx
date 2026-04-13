"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export function ArticleGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="mt-8 text-secondary">
        Articles coming soon. Subscribe to get notified.
      </p>
    );
  }

  return (
    <motion.div
      className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div
          key={post.slug}
          variants={cardVariants}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group block h-full rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/30 hover:bg-surface-elevated"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {post.category}
            </span>
            <h3 className="mt-3 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-secondary line-clamp-2">
              {post.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <time className="text-xs text-tertiary">{post.date}</time>
              <span className="text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Read more
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
