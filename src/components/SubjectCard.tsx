"use client";

import React, { useState } from "react";
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
import {
  Edit3Icon,
  EyeIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  ClockIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

// Utility function to get time of day emoji
const getTimeOfDayEmoji = (date: Date) => {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) return "🌅"; // Morning
  if (hours >= 12 && hours < 17) return "🌞"; // Afternoon
  if (hours >= 17 && hours < 20) return "🌆"; // Evening
  return "🌙"; // Night
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..."; // Append ellipsis if truncated
  }
  return text;
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
  studyStreak?: number;
  averageStudyTime?: number;
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
  studyStreak = 0,
  averageStudyTime = 0,
}: SubjectCardProps) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewChapters = () => {
    router.push(`/subjects/${id}/chapters`);
    if (onOpen) onOpen();
  };

  const progressPercentage =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  const maxLength = 20;
  const truncatedTitle = truncateText(title, maxLength);

  return (
    <Card className='w-full max-w-sm md:max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden transition-all duration-300 ease-in-out'>
      <CardHeader className='flex flex-col md:flex-row items-center gap-4 p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 relative'>
        <Avatar
          name={title}
          size='60'
          round={true}
          className='border-2 border-white'
        />
        <div className='flex flex-col justify-between items-center md:items-start flex-grow'>
          <CardTitle className='text-xl font-semibold dark:text-white truncate whitespace-normal capitalize text-black'>
            {truncatedTitle}
          </CardTitle>
          <div className='text-xs text-gray-800 dark:text-gray-300 mt-2 flex items-center'>
            <ClockIcon className='w-4 h-4 mr-1' />
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
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-black hover:bg-white/20 dark:text-white dark:hover:bg-gray-700'
        >
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </CardHeader>
      <CardContent className='p-4'>
        <div className='mb-4'>
          <Progress
            value={progressPercentage}
            className='w-full h-2 bg-gray-200 dark:bg-gray-700'
          />
          <div className='mt-2 text-sm text-gray-600 dark:text-gray-300 flex flex-col md:flex-row justify-between items-center'>
            <span>{progressPercentage.toFixed(1)}% Complete</span>
            <span className='flex items-center'>
              <BookOpenIcon className='w-4 h-4 mr-1' />
              {completedChapters} / {totalChapters} Chapters
            </span>
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className='mt-4 space-y-2'>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  <span className='font-semibold'>Study Streak:</span>{" "}
                  {studyStreak} days
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  <span className='font-semibold'>Avg. Study Time:</span>{" "}
                  {averageStudyTime} minutes
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  <span className='font-semibold'>Created:</span>{" "}
                  {createdAt ? formatDate(new Date(createdAt)) : "N/A"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className='flex flex-col md:flex-row justify-between p-4 bg-gray-50 dark:bg-gray-800'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 flex items-center justify-center mb-2 w-full md:w-auto'
              title='More Options'
            >
              <MoreHorizontalIcon className='mr-2' />
              More
            </Button>
          </DialogTrigger>
          <DialogContent className='m-5 rounded-md'>
            <DialogHeader>
              <DialogTitle>Manage Subject</DialogTitle>
            </DialogHeader>
            <DialogDescription className='capitalize'>
              Keep working hard, soldier!
            </DialogDescription>
            <Button
              onClick={() => onDelete(id)}
              className='bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center w-full mb-2'
              title='Delete Subject'
            >
              <Trash2Icon className='mr-2' />
              Delete
            </Button>
          </DialogContent>
        </Dialog>
        <Button
          onClick={handleViewChapters}
          className='bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 flex items-center justify-center w-full md:w-auto'
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
