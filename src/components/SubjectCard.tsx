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
import { Edit3Icon, EyeIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
    <Card className='w-full max-w-sm mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 mb-6'>
      <CardHeader className='flex items-center gap-4 p-4 bg-blue-100 dark:bg-blue-600 rounded-t-lg'>
        <Avatar
          name={title}
          size='60'
          round={true}
          className='border border-gray-300 dark:border-gray-600'
        />
        <div className='flex flex-col justify-between'>
          <CardTitle className='text-xl font-semibold text-gray-900 dark:text-gray-100 truncate'>
            {title}
          </CardTitle>
          {description && (
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1 truncate'>
              {description}
            </p>
          )}
          <div className='text-xs text-gray-500 dark:text-gray-300 mt-2'>
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
      <CardContent className='p-4'>
        <div className='mb-4'>
          <Progress value={progressPercentage} className='w-full' />
          <div className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
            {completedChapters} / {totalChapters} Chapters Completed
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg'>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className='bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 flex items-center justify-center'
              title='More Options'
            >
              <MoreHorizontalIcon className='mr-2' />
              More
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Subject</DialogTitle>
            </DialogHeader>
            <Button
              onClick={() => onEdit(id)}
              className='bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center mb-2 w-full'
              title='Edit Subject'
            >
              <Edit3Icon className='mr-2' />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(id)}
              className='bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center w-full'
              title='Delete Subject'
            >
              <Trash2Icon className='mr-2' />
              Delete
            </Button>
          </DialogContent>
        </Dialog>
        <Button
          onClick={handleViewChapters}
          className='bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 flex items-center justify-center'
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
