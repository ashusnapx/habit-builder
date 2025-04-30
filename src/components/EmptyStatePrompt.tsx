import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface EmptyStatePromptProps {
  onCreateClick: () => void;
  isLoggedIn: boolean;
}

/**
 * Displays an empty state with a call-to-action when no subjects exist
 */
const EmptyStatePrompt: React.FC<EmptyStatePromptProps> = ({
  onCreateClick,
  isLoggedIn,
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center text-center p-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'
    >
      <div className='mb-6 relative w-40 h-40'>
        <Image
          src='/empty-state-illustration.svg'
          alt='No subjects found'
          width={160}
          height={160}
          className='object-contain'
          onError={(e) => {
            // Fallback if image is not found
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src =
              "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'/%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'/%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'/%3E%3C/svg%3E";
          }}
        />
      </div>

      <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
        {isLoggedIn
          ? "Time to start learning!"
          : "Welcome to your learning hub!"}
      </h2>

      <p className='text-gray-600 dark:text-gray-400 max-w-md mb-6'>
        {isLoggedIn
          ? "Create your first subject to organize chapters and track your progress."
          : "Sign in to create subjects, organize your study materials, and track your learning progress."}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateClick}
        className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-200 font-medium flex items-center'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2'
        >
          <line x1='12' y1='5' x2='12' y2='19'></line>
          <line x1='5' y1='12' x2='19' y2='12'></line>
        </svg>
        {isLoggedIn ? "Create Your First Subject" : "Sign In to Get Started"}
      </motion.button>
    </motion.div>
  );
};

export default EmptyStatePrompt;
