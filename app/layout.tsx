import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "30-Day DSA Tracker — Gokul",
  description:
    "Track your 30-day DSA journey with Striver's A2Z sheet. Built by Gokul.",
  metadataBase: new URL("https://dsa-tracker.vercel.app"),
  openGraph: {
    title: "30-Day DSA Tracker",
    description:
      "A minimal, beautiful tracker for 30 days of DSA practice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <head>
        <meta name="theme-color" content="#1c1c1a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#eeede9" media="(prefers-color-scheme: light)" />
      </head>
      <body>{children}</body>
    </html>
  );
}
