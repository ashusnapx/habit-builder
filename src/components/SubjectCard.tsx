"use client";

import React from "react";
import Avatar from "react-avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";

// Utility function to get time of day emoji
const getTimeOfDayEmoji = (date: Date) => {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) return "🌅"; // Morning
  if (hours >= 12 && hours < 17) return "🌞"; // Afternoon
  if (hours >= 17 && hours < 20) return "🌆"; // Evening
  return "🌙"; // Night
};

// Format date as "MMM D, YYYY h:mm A"
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

interface SubjectCardProps {
  id: string;
  title: string;
  description?: string;
  completedChapters: number;
  totalChapters: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen?: () => void;
  createdAt?: Date;
  lastOpened?: Date;
}

const SubjectCard = ({
  id,
  title,
  description,
  completedChapters,
  totalChapters,
  onEdit,
  onDelete,
  onOpen,
  createdAt,
  lastOpened,
}: SubjectCardProps) => {
  const router = useRouter();

  const handleViewChapters = () => {
    router.push(`/subjects/${id}/chapters`);
    if (onOpen) onOpen();
  };

  const progressPercentage =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <Card className='w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 mb-8'>
      <CardHeader className='flex items-center gap-4 p-6 bg-custom-bg dark:bg-gray-700 rounded-t-lg'>
        <Avatar
          name={title}
          size='60'
          round={true}
          className='border border-gray-300 dark:border-gray-600'
        />
        <div>
          <CardTitle className='text-xl font-bold text-white'>
            {title}
          </CardTitle>
          {description && (
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              {description}
            </p>
          )}
          <div className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            <p>
              Last opened:{" "}
              {lastOpened
                ? `${formatDate(new Date(lastOpened))} ${getTimeOfDayEmoji(
                    new Date(lastOpened)
                  )}`
                : "N/A"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='mb-4'>
          <Progress value={progressPercentage} className='w-full' />
          <div className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            {completedChapters} / {totalChapters} Chapters Completed
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col sm:flex-row justify-between p-4 bg-gray-50 dark:bg-gray-700 gap-2 rounded-b-lg'>
        <Button
          onClick={() => onEdit(id)}
          className='bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto'
          title='Edit Subject'
        >
          <Edit3Icon className='mr-2' />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(id)}
          className='bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center w-full sm:w-auto'
          title='Delete Subject'
        >
          <Trash2Icon className='mr-2' />
          Delete
        </Button>
        <Button
          onClick={handleViewChapters}
          className='bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 flex items-center justify-center w-full sm:w-auto'
          title='View Chapters'
        >
          <EyeIcon className='mr-2' />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
