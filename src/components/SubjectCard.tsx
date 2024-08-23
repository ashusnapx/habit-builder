"use client";

import * as React from "react";
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
import { DeleteIcon, Edit2Icon } from "lucide-react";

interface SubjectCardProps {
  id: string;
  title: string;
  description?: string;
  completedChapters: number;
  totalChapters: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SubjectCard = ({
  id,
  title,
  description,
  completedChapters,
  totalChapters,
  onEdit,
  onDelete,
}: SubjectCardProps) => {
  const router = useRouter();

  const handleViewChapters = () => {
    router.push(`/subjects/${id}/chapters`);
  };

  // Calculate progress percentage
  const progressPercentage =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <Card className='w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 mb-8'>
      <CardHeader className='flex items-center gap-4 p-6 bg-gray-100 dark:bg-gray-700 rounded-t-lg'>
        <Avatar
          name={title}
          size='60'
          round={true}
          className='border border-gray-300 dark:border-gray-600'
        />
        <div>
          <CardTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>
            {title}
          </CardTitle>
          {description && (
            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
              {description}
            </p>
          )}
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
      <CardFooter className='flex justify-between p-4 bg-gray-50 dark:bg-gray-700 gap-1 rounded-b-lg'>
        <Button
          onClick={() => onEdit(id)}
          className='bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
        >
          <Edit2Icon/>
        </Button>
        <Button
          onClick={() => onDelete(id)}
          className='bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
        >
          <DeleteIcon/>
        </Button>
        <Button
          onClick={handleViewChapters}
          className='bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
        >
          View Chapters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
