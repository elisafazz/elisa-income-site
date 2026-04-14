import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for AI Tool Breakdown - how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-tertiary">Effective date: April 13, 2026</p>

      <div className="mt-8 space-y-6 text-secondary">
        <p>
          AI Tool Breakdown (&quot;ATB,&quot; &quot;we,&quot; &quot;us&quot;) operates
          the website at aitoolbreakdown.com. This policy explains what data we
          collect, how we use it, and your rights regarding that data.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Data we collect
        </h2>
        <p>
          <strong className="text-foreground">Analytics.</strong> We use Google
          Analytics 4 (measurement ID G-8KE4RCBZ4H) to collect anonymous usage
          data, including pages visited, time on site, referral source, device
          type, and approximate location. Google Analytics uses cookies to
          distinguish users. No personally identifiable information is collected
          through analytics.
        </p>
        <p>
          <strong className="text-foreground">Email signups.</strong> If you
          subscribe to our newsletter, we collect your email address through
          Beehiiv, our email platform. We use this solely to send you newsletter
          content. You can unsubscribe at any time via the link in every email.
        </p>
        <p>
          <strong className="text-foreground">Purchase data.</strong> If you buy
          a digital product, payment and order data is handled by Gumroad or
          Etsy. We do not store your payment information. These platforms have
          their own privacy policies.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Cookies
        </h2>
        <p>
          This site uses cookies for Google Analytics (traffic measurement) and
          may set cookies through embedded third-party services. We do not use
          cookies for advertising or tracking across other websites. Most
          browsers let you disable cookies in their settings, though this may
          affect site functionality.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Third-party services
        </h2>
        <p>We use the following third-party services that may process your data:</p>
        <ul className="list-none space-y-1">
          <li>- Google Analytics 4 (site analytics)</li>
          <li>- Beehiiv (newsletter and email delivery)</li>
          <li>- Gumroad (digital product sales)</li>
          <li>- Etsy (digital product sales)</li>
          <li>- Pinterest API (content distribution)</li>
        </ul>
        <p>
          Each service operates under its own privacy policy. We recommend
          reviewing them if you have concerns about how your data is handled.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Affiliate links
        </h2>
        <p>
          Some pages contain affiliate links to services including Beehiiv,
          Make.com, Semrush, HubSpot, and Frase. Clicking these links may allow
          affiliate networks to set cookies to attribute a referral. These
          cookies are governed by each affiliate program&apos;s privacy policy.
          See our{" "}
          <a href="/affiliate-disclosure" className="text-accent hover:underline">
            affiliate disclosure
          </a>{" "}
          for more details.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Email communication
        </h2>
        <p>
          We send emails only to subscribers who opted in through our newsletter
          signup. We do not sell, rent, or share your email address with third
          parties. Every email includes an unsubscribe link. If you unsubscribe,
          we remove your address from our active mailing list.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Data retention
        </h2>
        <p>
          Analytics data is retained according to Google Analytics default
          settings (14 months). Email addresses are retained until you
          unsubscribe. Purchase records are maintained by Gumroad and Etsy per
          their respective policies.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Your rights (CCPA / GDPR)
        </h2>
        <p>
          If you are a California resident or located in the European Economic
          Area, you have the right to:
        </p>
        <ul className="list-none space-y-1">
          <li>- Request access to the personal data we hold about you</li>
          <li>- Request deletion of your personal data</li>
          <li>- Opt out of the sale of your personal data (we do not sell personal data)</li>
          <li>- Withdraw consent for data processing</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at the email below. We
          will respond within 30 days.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Children&apos;s privacy
        </h2>
        <p>
          This site is not directed at children under 13. We do not knowingly
          collect data from children. If you believe a child has provided us
          with personal information, contact us and we will delete it.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Changes to this policy
        </h2>
        <p>
          We may update this policy from time to time. Changes will be posted on
          this page with a revised effective date.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        <p>
          For privacy-related questions or requests, email us at{" "}
          <a
            href="mailto:ironchef46gaming@gmail.com"
            className="text-accent hover:underline"
          >
            ironchef46gaming@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
