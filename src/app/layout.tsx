import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aitoolbreakdown.com"),
  title: {
    default: "AI Tool Breakdown - Honest AI & SaaS Tool Reviews",
    template: "%s | AI Tool Breakdown",
  },
  description:
    "Honest, in-depth comparisons of AI and SaaS tools. No vendor bias, no fluff - just real reviews to help you pick the right tools for your workflow.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aitoolbreakdown.com",
    siteName: "AI Tool Breakdown",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "impact-site-verification": "a36b1c28-a4ee-4248-9e92-163ec68ce255",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
