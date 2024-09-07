import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components";
import Footer from "@/components/Footer";
import Script from "next/script";
import { JsonLd } from "react-schemaorg";
import { Organization } from "schema-dts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://habit-ai-lake.vercel.app"),
  title: {
    default: "HabitAI - Intelligent Habit Tracking and Management",
    template: "%s | HabitAI",
  },
  description:
    "HabitAI is your all-in-one solution for managing and tracking habits with AI-powered insights. Boost productivity, achieve goals, and transform your life with smart habit tracking.",
  keywords: [
    "habit tracking",
    "AI-powered habits",
    "productivity app",
    "goal achievement",
    "personal development",
    "smart habit management",
    "lifestyle improvement",
    "daily routine optimization",
    "behavior change",
    "habit formation",
  ],
  authors: [{ name: "HabitAI Team" }],
  creator: "HabitAI",
  publisher: "HabitAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://habit-ai-lake.vercel.app/",
    siteName: "HabitAI",
    title: "HabitAI - Transform Your Life with AI-Powered Habit Tracking",
    description:
      "Revolutionize your personal growth with HabitAI. Our intelligent app helps you build, track, and optimize habits for a more productive and fulfilling life.",
    images: [
      {
        url: "https://habit-ai-lake.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HabitAI - Intelligent Habit Tracking and Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@HabitAI",
    creator: "@HabitAI",
    title: "HabitAI - Smart Habit Tracking for a Better You",
    description:
      "Unlock your potential with HabitAI. Our AI-driven app helps you cultivate positive habits, reach your goals, and live your best life.",
    images: ["https://habit-ai-lake.vercel.app/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://habit-ai-lake.vercel.app",
    languages: {
      "en-US": "https://habit-ai-lake.vercel.app",
    },
  },
  category: "Productivity",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </head>
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
          <main className='flex-grow p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900'>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Script
          strategy='afterInteractive'
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
        <JsonLd<Organization>
          item={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HabitAI",
            url: "https://habit-ai-lake.vercel.app",
            logo: "https://habit-ai-lake.vercel.app/logo.png",
            sameAs: [
              "https://twitter.com/HabitAI",
              "https://www.facebook.com/HabitAI",
              "https://www.linkedin.com/company/habitai",
            ],
          }}
        />
      </body>
    </html>
  );
}
