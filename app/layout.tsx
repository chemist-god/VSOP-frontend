import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/pebble-toast";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://support.veritrack.cloud"),
  title: "VeriTrack VSOP — Internal Support Operations",
  description:
    "Centralize client portal support tickets, assign your team, and track every resolution — no more lost WhatsApp threads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${fontSans.variable}`}
    >
      <body className="antialiased bg-background text-foreground font-sans">
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            {children}
            <Toaster position="bottom-right" duration={6000} />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
