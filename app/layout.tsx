import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Numberdi",
  description: "Fast multiplayer number-order race with private rooms, countdowns, and winner results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased font-sans">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
