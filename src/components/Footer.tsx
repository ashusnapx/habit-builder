"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

const Footer = () => {
  return (
    <footer className='bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 tracking-tighter border-t border-gray-200 dark:border-gray-700'>
      <div className='container mx-auto py-6 px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='flex flex-col items-center md:items-start'>
            <h2 className='text-2xl font-bold mb-2'>Habit.AI</h2>
            <p className='mb-4'>Baked with ❤️ by Ashutosh Kumar</p>
            <div className='flex space-x-4 mb-4'>
              <Link
                href='https://twitter.com/ashusnapx'
                target='_blank'
                className='hover:text-blue-500 dark:hover:text-blue-300'
              >
                <Twitter size={20} />
              </Link>
              <Link
                href='https://github.com/ashusnapx'
                target='_blank'
                className='hover:text-gray-600 dark:hover:text-gray-400'
              >
                <Github size={20} />
              </Link>
            </div>
          </div>
          <div className='flex flex-col items-center md:items-end'>
            <ul className='space-y-2 mb-4'>
              <li>
                <Link
                  href='/'
                  className='hover:text-blue-600 dark:hover:text-blue-400'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='hover:text-blue-600 dark:hover:text-blue-400'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='hover:text-blue-600 dark:hover:text-blue-400'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-200 dark:border-gray-700 pt-4 text-center'>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} Habit.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
