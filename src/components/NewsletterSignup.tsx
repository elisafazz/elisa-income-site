"use client";

import Script from "next/script";

export function NewsletterSignup() {
  return (
    <>
      <Script
        src="https://subscribe-forms.beehiiv.com/embed.js"
        strategy="lazyOnload"
      />
      <iframe
        src="https://subscribe-forms.beehiiv.com/762e2c33-80b5-4065-9736-7a9a7b209c55"
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
        style={{
          width: "100%",
          maxWidth: "463px",
          height: "365px",
          margin: "0 auto",
          borderRadius: "12px",
          backgroundColor: "transparent",
          boxShadow: "none",
          display: "block",
        }}
      />
    </>
  );
}
