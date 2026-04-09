"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Connect to Beehiiv API once account is created
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-blue-50 p-6 text-center">
        <p className="text-lg font-medium text-blue-900">
          Thanks for subscribing!
        </p>
        <p className="mt-1 text-sm text-blue-700">
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-gray-50 p-6">
      <p className="text-lg font-semibold text-gray-900">
        Get the weekly AI tool roundup
      </p>
      <p className="mt-1 text-sm text-gray-600">
        One email per week. The best AI tools, tips, and deals - no spam.
      </p>
      <div className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
