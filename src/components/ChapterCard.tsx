import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChapterCardProps {
  id: string;
  title: string;
  completed: boolean;
  onCompleteChange: (id: string, completed: boolean) => void;
}

const ChapterCard = ({
  id,
  title,
  completed,
  onCompleteChange,
}: ChapterCardProps) => (
  <Card className='w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
    <CardHeader className='p-4'>
      <CardTitle className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className='p-4'>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        Status: {completed ? "Completed" : "Not Completed"}
      </p>
    </CardContent>
    <CardFooter className='flex justify-between p-4'>
      <Button
        variant={completed ? "outline" : "default"}
        onClick={() => onCompleteChange(id, !completed)}
        className={`text-white ${completed ? "bg-gray-500" : "bg-blue-500"}`}
      >
        {completed ? "Undo" : "Mark as Complete"}
      </Button>
    </CardFooter>
  </Card>
);

export default ChapterCard;
