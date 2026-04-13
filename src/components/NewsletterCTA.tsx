export function NewsletterCTA() {
  return (
    <section className="mt-14 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
      <h2 className="text-base font-semibold text-gray-900">
        Get the best tool deals in your inbox
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Weekly picks, pricing changes, and exclusive discounts. Free.
      </p>
      <iframe
        src="https://aitoolbreakdown.beehiiv.com/subscribe"
        data-test-id="beehiiv-embed"
        height="52"
        frameBorder="0"
        scrolling="no"
        style={{
          margin: "0 auto",
          borderRadius: "0px",
          backgroundColor: "transparent",
          width: "100%",
          maxWidth: "400px",
          marginTop: "16px",
        }}
      />
    </section>
  );
}
