
import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amitymusicgroup.com"),

  title: {
    default: "Amity Music Group | Independent Culture. Major Sound.",
    template: "%s | Amity Music Group",
  },

  description:
    "Amity Music Group is an independent music organization focused on recorded music, artist development, music publishing, distribution, management, and creative ventures.",

  applicationName: "Amity Music Group",

  openGraph: {
    type: "website",
    siteName: "Amity Music Group",
    title: "Amity Music Group | Independent Culture. Major Sound.",
    description:
      "Discover the artists, music, labels, publishing, and creative ventures of Amity Music Group.",
    url: "https://amitymusicgroup.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "Amity Music Group",
    description: "Independent Culture. Major Sound.",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-white font-sans text-[#111111]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
