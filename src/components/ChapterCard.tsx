"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disc3Icon, SmileIcon } from "lucide-react";

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
}: ChapterCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      await onCompleteChange(id, !completed); // Assuming this function is asynchronous
    } catch (error) {
      console.error("Error updating completion status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg tracking-tighter'>
      <CardHeader className='p-4'>
        <CardTitle className='font-semibold text-gray-900 dark:text-gray-100 capitalize text-2xl tracking-wider'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        <p className='text-md text-gray-600 dark:text-gray-400'>
          Status: {completed ? "Completed" : "Not Completed"}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between p-4'>
        <Button
          variant={completed ? "outline" : "default"}
          onClick={handleButtonClick}
          className={`text-white ${
            completed ? "bg-gray-500" : "bg-blue-500"
          } flex items-center`}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <Disc3Icon size={20} className="animate-spin"/>
          ) : completed ? (
            "Undo"
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChapterCard;
