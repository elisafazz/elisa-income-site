export function NewsletterCTA() {
  return (
    <section className="mt-14 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
      <h2 className="text-base font-semibold text-gray-900">
        Get the best tool deals in your inbox
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Weekly picks, pricing changes, and exclusive discounts. Free.
      </p>
      <form action="#" method="POST" className="mt-4 flex justify-center gap-2">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
