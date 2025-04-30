import React from "react";
import { motion } from "framer-motion";

interface SubjectMetricsProps {
  totalSubjects: number;
  totalChapters: number;
  completedChapters: number;
  overallProgress: number;
}

/**
 * Displays analytics about subject and chapter completion
 */
const SubjectMetrics: React.FC<SubjectMetricsProps> = ({
  totalSubjects,
  totalChapters,
  completedChapters,
  overallProgress,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700'
    >
      <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
        Your Learning Progress
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
          <p className='text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1'>
            Subjects
          </p>
          <p className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
            {totalSubjects}
          </p>
        </div>

        <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
          <p className='text-sm text-green-600 dark:text-green-400 font-semibold mb-1'>
            Total Chapters
          </p>
          <p className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
            {totalChapters}
          </p>
        </div>

        <div className='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
          <p className='text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1'>
            Completed
          </p>
          <p className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
            {completedChapters}
          </p>
        </div>

        <div className='bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg'>
          <p className='text-sm text-amber-600 dark:text-amber-400 font-semibold mb-1'>
            Overall Progress
          </p>
          <div className='flex items-center'>
            <p className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
              {overallProgress}%
            </p>
            <div className='ml-3 flex-grow'>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                <div
                  className='bg-amber-500 h-2.5 rounded-full'
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectMetrics;
