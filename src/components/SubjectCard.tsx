import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Chapter } from "../../types/subject";

interface SubjectCardProps {
  id: string;
  title: string;
  description: string;
  completedChapters: number;
  totalChapters: number;
  progressPercentage: number;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
  createdAt: Date;
  lastOpened: Date;
  viewMode: "grid" | "list";
  chapters?: Chapter[];
}

/**
 * Card component displaying subject details and actions
 */
const SubjectCard: React.FC<SubjectCardProps> = ({
  id,
  title,
  description,
  completedChapters,
  totalChapters,
  progressPercentage,
  onEdit,
  onDelete,
  onOpen,
  createdAt,
  lastOpened,
  viewMode,
  chapters,
}) => {
  const formatTimeAgo = (date: Date) => {
    try {
      if (date && date.getTime() > 0) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return "Never";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Generate a random but consistent color based on subject title
  const getSubjectColor = (title: string) => {
    const colors = [
      "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
      "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200",
      "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200",
      "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200",
    ];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const subjectColorClass = getSubjectColor(title);
  const iconLetter = title.charAt(0).toUpperCase();

  // Determine status based on progress
  const getStatusBadge = () => {
    if (totalChapters === 0) {
      return (
        <span className='px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
          Empty
        </span>
      );
    } else if (progressPercentage === 100) {
      return (
        <span className='px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'>
          Completed
        </span>
      );
    } else if (progressPercentage > 0) {
      return (
        <span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'>
          In Progress
        </span>
      );
    } else {
      return (
        <span className='px-2 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'>
          Not Started
        </span>
      );
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200'
      >
        <div className='p-5 flex items-center'>
          <div
            className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg mr-4 ${subjectColorClass}`}
          >
            {iconLetter}
          </div>

          <div className='flex-grow min-w-0'>
            <div className='flex items-center justify-between mb-1'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 truncate capitalize'>
                {title}
              </h3>
              {getStatusBadge()}
            </div>

            <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1'>
              {description || "No description provided"}
            </p>
          </div>

          <div className='flex-shrink-0 ml-4 flex items-center'>
            <div className='mr-4 text-right'>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                Progress
              </div>
              <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                {completedChapters}/{totalChapters} chapters
              </div>
            </div>

            <div className='flex space-x-2'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className='p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'
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
                >
                  <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
                  <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className='p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors'
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
                >
                  <polyline points='3 6 5 6 21 6'></polyline>
                  <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
                className='p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
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
                >
                  <path d='M5 12h14'></path>
                  <path d='M12 5l7 7-7 7'></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className='h-1 w-full bg-gray-200 dark:bg-gray-700'>
          <div
            className='h-1 bg-blue-500'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200'
      onClick={onOpen}
    >
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg ${subjectColorClass} text-lg font-bold`}
          >
            {iconLetter}
          </div>

          <div className='flex space-x-1'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className='p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'
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
              >
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className='p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors'
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
              >
                <polyline points='3 6 5 6 21 6'></polyline>
                <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
              </svg>
            </button>
          </div>
        </div>

        <div className='mb-4'>
          <div className='flex items-center justify-between mb-1'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 truncate capitalize'>
              {title}
            </h3>
            {getStatusBadge()}
          </div>

          <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]'>
            {description || "No description provided"}
          </p>
        </div>

        <div className='mb-4'>
          <div className='flex justify-between text-sm mb-1'>
            <span className='text-gray-600 dark:text-gray-400'>Progress</span>
            <span className='font-medium text-gray-800 dark:text-gray-200'>
              {progressPercentage}%
            </span>
          </div>
          <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
            <div
              className='bg-blue-500 h-2.5 rounded-full'
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
          <div>
            <p>
              {completedChapters}/{totalChapters} chapters
            </p>
          </div>
          <div className='text-right'>
            <p>Last opened: {formatTimeAgo(lastOpened)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectCard;
