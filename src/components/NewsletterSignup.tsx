export function NewsletterSignup() {
  return (
    <div className="rounded-lg bg-gray-50 p-6">
      <p className="text-lg font-semibold text-gray-900">
        Get the weekly AI tool roundup
      </p>
      <p className="mt-1 text-sm text-gray-600">
        One email per week. The best AI tools, tips, and deals - no spam.
      </p>
      <iframe
        src="https://aitoolbreakdown.beehiiv.com/subscribe"
        data-test-id="beehiiv-embed"
        height="52"
        frameBorder="0"
        scrolling="no"
        style={{
          margin: 0,
          borderRadius: "0px",
          backgroundColor: "transparent",
          width: "100%",
          marginTop: "16px",
        }}
      />
    </div>
  );
}
