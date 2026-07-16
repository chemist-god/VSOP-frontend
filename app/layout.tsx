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
  applicationName: "VSOP",
  title: {
    default: "VeriTrack VSOP — Internal Support Operations",
    template: "%s · VSOP",
  },
  description:
    "Centralize client portal support tickets, assign your team, and track every resolution — no more lost WhatsApp threads.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
    shortcut: ["/icon.svg"],
  },
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
