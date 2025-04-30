/**
 * not-found.tsx
 *
 * A professionally designed 404 Not Found page component for the Habit.AI application.
 * This page is displayed when users navigate to routes that do not exist within the application.
 *
 * Features:
 * - Custom illustration with responsive design
 * - Clear error messaging with actionable recovery options
 * - Search functionality to help users find what they're looking for
 * - Recent pages suggestion based on common destinations
 * - Smooth animations to enhance user experience
 *
 * @author Ashutosh Kumar
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Home, ArrowLeft, ExternalLink } from "lucide-react";

/**
 * Interface for suggested pages to help users navigate after encountering a 404 error
 */
interface SuggestedPage {
  title: string;
  href: string;
  description: string;
}

/**
 * NotFound component renders a user-friendly 404 page with helpful navigation options
 * and search functionality to improve user experience when they encounter missing content.
 */
const NotFound: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  // Popular pages that users might be looking for
  const suggestedPages: SuggestedPage[] = [
    {
      title: "Home",
      href: "/",
      description: "Go back to homepage",
    },
    {
      title: "Hire Ashutosh ✨",
      href: "https://ashusnapx.vercel.app/",
      description: "He's a good developer BTW",
    },
    {
      title: "SignUp",
      href: "/sign-up",
      description: "Create an account",
    },
  ];

  // Animation effect on component mount
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  /**
   * Handles the search form submission
   * @param e - Form submit event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real implementation, this would redirect to search results
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  /**
   * Navigates back to the previous page in history
   */
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-16'>
      <div
        className={`max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-out ${
          isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className='p-6 md:p-12'>
          {/* 404 Header */}
          <div className='text-center mb-8'>
            <h1 className='text-6xl md:text-8xl font-bold text-blue-600 dark:text-blue-400 mb-4'>
              404
            </h1>
            <h2 className='text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
              Page Not Found
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-lg mx-auto'>
              We&apos;re sorry, but the page you were looking for doesn&apos;t
              exist. It might have been moved or deleted.
            </p>
          </div>

          {/* Stylized Illustration */}
          <div className='relative h-40 md:h-48 mb-8 flex items-center justify-center'>
            <div className='absolute w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full'></div>
            <div className='relative z-10 text-center'>
              <div className='w-16 h-16 mx-auto mb-2 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center'>
                <ExternalLink size={32} className='text-white' />
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Link not found
              </p>
            </div>
          </div>

          {/* Search Functionality */}
          <div className='mb-10'>
            <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 text-center'>
              Search for what you need
            </h3>
            <form onSubmit={handleSearch} className='flex items-center'>
              <div className='relative flex-grow'>
                <input
                  type='text'
                  placeholder='Try searching for pages...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                  aria-label='Search'
                />
                <Search
                  size={18}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                />
              </div>
              <button
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg transition-colors duration-200 font-medium'
              >
                Search
              </button>
            </form>
          </div>

          {/* Suggested Pages */}
          <div className='mb-10'>
            <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 mb-4'>
              Popular Destinations
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {suggestedPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200'
                >
                  <h4 className='font-medium text-blue-600 dark:text-blue-400 mb-1'>
                    {page.title}
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Actions */}
          <div className='flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4'>
            <button
              onClick={handleGoBack}
              className='flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-full sm:w-auto'
            >
              <ArrowLeft size={16} className='mr-2' />
              Go Back
            </button>
            <Link
              href='/'
              className='flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 w-full sm:w-auto'
            >
              <Home size={16} className='mr-2' />
              Return Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-center text-sm text-gray-600 dark:text-gray-300'>
          Need assistance?{" "}
          <Link
            href='/contact'
            className='text-blue-600 dark:text-blue-400 hover:underline'
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
