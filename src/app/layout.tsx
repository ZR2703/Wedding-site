import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Inter, Cinzel, Cormorant_Garamond } from "next/font/google";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const names = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-names",
});
const invite = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-invite",
});

export const metadata: Metadata = {
  title: "Ruben & Zara — Wedding",
  description: "Wedding website for Ruben & Zara",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} ${names.variable} ${invite.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
