import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HabitAI",
  description:
    "HabitAI - Your go-to app for managing and tracking habits with intelligent insights.",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "HabitAI",
    description:
      "HabitAI - Your go-to app for managing and tracking habits with intelligent insights.",
    url: "https://habit-ai-lake.vercel.app/",
    siteName: "HabitAI",
    images: [
      {
        url: "https://habit-ai-lake.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HabitAI - Manage and Track Your Habits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@HabitAI",
    creator: "@HabitAI",
    title: "HabitAI",
    description:
      "HabitAI - Your go-to app for managing and tracking habits with intelligent insights.",
    images: "https://habit-ai-lake.vercel.app/twitter-image.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>{/* Meta tags here */}</head>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className='flex-grow p-4 sm:p-6 lg:p-8'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
