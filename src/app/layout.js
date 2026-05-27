import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "HireQuest — Your Career. Your Quest.",
  description:
    "HireQuest turns your job search into an adventure. Explore opportunities on an interactive world map, level up your skills, defeat challenges, and build your legacy. A gamified AI recruitment platform.",
  keywords: [
    "jobs",
    "recruitment",
    "gamified hiring",
    "video resume",
    "AI recruitment",
    "world map jobs",
  ],
  authors: [{ name: "Dhanvi" }],
  openGraph: {
    title: "HireQuest — Your Career. Your Quest.",
    description:
      "Turn your job search into an epic adventure. Explore, quest, level up.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
