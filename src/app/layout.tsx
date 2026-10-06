import type { Metadata, Viewport } from "next";
import { Bungee, Outfit } from "next/font/google";
import "./globals.css";

const display = Bungee({ variable: "--font-display", weight: "400", subsets: ["latin"] });
const body = Outfit({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Muvz · FinStack IQ",
  description: "Money Muvz: a learn-by-doing financial-life game for grades 6–8. Create. Earn. Own.",
};

export const viewport: Viewport = {
  themeColor: "#100d22",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
