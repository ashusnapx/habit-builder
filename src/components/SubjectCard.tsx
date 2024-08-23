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
import { useRouter } from "next/navigation";

interface SubjectCardProps {
  id: string;
  title: string;
  description?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SubjectCard = ({
  id,
  title,
  description,
  onEdit,
  onDelete,
}: SubjectCardProps) => {
  const router = useRouter();

  const handleViewChapters = () => {
    router.push(`/subjects/${id}/chapters`);
  };

  return (
    <Card className='w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
      <CardHeader className='flex items-center gap-4 p-6'>
        <Avatar
          name={title}
          size='50'
          round={true}
          className='border border-gray-300 dark:border-gray-700'
        />
        <div>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize'>
            {title}
          </CardTitle>
          {description && (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardFooter className='flex justify-between p-5 gap-2'>
        <Button
          onClick={() => onEdit(id)}
          className='bg-blue-500 text-white dark:bg-blue-600'
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(id)}
          className='bg-red-500 text-white dark:bg-red-600'
        >
          Delete
        </Button>
        <Button
          onClick={handleViewChapters}
          className='bg-green-500 text-white dark:bg-green-600'
        >
          View Chapters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
