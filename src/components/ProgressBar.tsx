// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  progressPercentage: number;
  dailyTarget: number;
  todayTarget: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercentage,
  dailyTarget,
  todayTarget,
}) => {
  return (
    <div className='mb-4'>
      <p>Today&apos;s Target: {todayTarget} chapters</p>
      <p>
        Chapters Completed: {dailyTarget} / {dailyTarget + todayTarget}
      </p>
      <div className='w-full bg-gray-200 rounded'>
        <div
          className='bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded'
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage.toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
