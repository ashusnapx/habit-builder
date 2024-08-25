// src/app/layout.tsx
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
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='HabitAI - Your go-to app for managing and tracking habits with intelligent insights.'
        />
        <meta name='robots' content='index, follow' />
        <meta property='og:title' content='HabitAI' />
        <meta
          property='og:description'
          content='HabitAI - Your go-to app for managing and tracking habits with intelligent insights.'
        />
        <meta property='og:url' content='https://habit-ai-lake.vercel.app/' />
        <meta property='og:site_name' content='HabitAI' />
        <meta
          property='og:image'
          content='https://habit-ai-lake.vercel.app/og-image.jpg'
        />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@HabitAI' />
        <meta name='twitter:creator' content='@HabitAI' />
        <meta name='twitter:title' content='HabitAI' />
        <meta
          name='twitter:description'
          content='HabitAI - Your go-to app for managing and tracking habits with intelligent insights.'
        />
        <meta
          name='twitter:image'
          content='https://habit-ai-lake.vercel.app/twitter-image.jpg'
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "HabitAI",
              url: "https://habit-ai-lake.vercel.app/",
              description:
                "HabitAI - Your go-to app for managing and tracking habits with intelligent insights.",
              sameAs: [
                "https://twitter.com/HabitAI",
                "https://facebook.com/HabitAI",
                // Add other social media profiles if available
              ],
            }),
          }}
        />
        <link rel='canonical' href='https://habit-ai-lake.vercel.app/' />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className='flex-grow'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
