"use client";

import { motion } from "framer-motion";
import { NewsletterSignup } from "./NewsletterSignup";

export function NewsletterCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="mt-14"
    >
      <NewsletterSignup />
    </motion.div>
  );
}
