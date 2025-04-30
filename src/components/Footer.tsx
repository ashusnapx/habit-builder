/**
 * Footer.tsx
 *
 * A responsive, accessible, and visually appealing footer component for the Habit.AI application.
 *
 * Features:
 * - Fully typed with TypeScript
 * - Responsive design (mobile-first approach)
 * - Accessibility compliant with proper ARIA attributes
 * - Smooth hover animations and transitions
 * - Dark mode support
 * - Social media integration
 *
 * @author Ashutosh Kumar
 * @version 1.0.0
 */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Twitter, Github, Mail, Phone, ArrowUp, Heart } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

// Type definitions for the Footer component
interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface FooterProps {
  showBackToTop?: boolean;
  extraLinks?: FooterLink[];
}

/**
 * Footer component that displays branding, navigation links, social media icons,
 * and copyright information.
 */
const Footer: React.FC<FooterProps> = ({
  showBackToTop = true,
  extraLinks = [],
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();

  // Navigation links configuration
  const navigationLinks: FooterLink[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    ...extraLinks,
  ];

  // Social media links configuration
  const socialLinks: SocialLink[] = [
    {
      href: "https://twitter.com/ashusnapx",
      icon: <Twitter size={20} aria-hidden='true' />,
      label: "Twitter",
    },
    {
      href: "https://github.com/ashusnapx",
      icon: <Github size={20} aria-hidden='true' />,
      label: "GitHub",
    },
    {
      href: "mailto:contact@habit.ai",
      icon: <Mail size={20} aria-hidden='true' />,
      label: "Email",
    },
  ];

  // Back to top button visibility handler
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className='relative bg-gradient-to-r from-blue-50 via-white to-blue-100 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 tracking-tight border-t border-gray-200 dark:border-gray-700 transition-colors duration-300'>
      {/* Welcome Banner - Adds a personalized touch */}
      <div className='bg-blue-600 dark:bg-blue-800 text-white py-3 px-4 text-center'>
        <p className='text-sm md:text-base font-medium'>
          Welcome to Habit.AI — Your personal habit tracking assistant
        </p>
      </div>

      <div className='container mx-auto py-8 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Branding Section */}
          <div className='flex flex-col'>
            <h2 className='text-2xl font-bold mb-4 flex items-center'>
              Habit.AI
              <span className='ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full'>
                Beta
              </span>
            </h2>
            <p className='mb-6 text-sm text-gray-600 dark:text-gray-300'>
              Building better habits, one day at a time. Powered by advanced AI
              to help you stay consistent.
            </p>
            <div className='flex items-center space-x-1 mb-6'>
              <span>Made with</span>
              <Heart
                size={16}
                className='text-red-500 mx-1 animate-pulse'
                fill='currentColor'
              />
              <span>by Ashutosh Kumar</span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              {navigationLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center'
                  >
                    <span className='border-b border-transparent hover:border-current'>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              Legal
            </h3>
            <ul className='space-y-2'>
              {navigationLinks.slice(3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center'
                  >
                    <span className='border-b border-transparent hover:border-current'>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className='flex flex-col'>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>
              Connect
            </h3>
            <div className='flex flex-wrap gap-3 mb-6'>
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={social.label}
                  className='bg-white dark:bg-gray-800 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 shadow-sm hover:shadow-md'
                >
                  {social.icon}
                </Link>
              ))}
            </div>
            <div className='mt-auto'>
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Copyright and Trademark Section */}
        <div className='border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            &copy; {currentYear} Habit.AI. All rights reserved.
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>
            Version 1.0.0
          </p>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          } fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-700 p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          aria-label='Back to top'
        >
          <ArrowUp size={20} aria-hidden='true' />
        </button>
      )}
    </footer>
  );
};

export default Footer;
