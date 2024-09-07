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
import { Disc3Icon } from "lucide-react";
import Image from "next/image";

interface ChapterCardProps {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // Adding created date
  onCompleteChange: (id: string, completed: boolean) => void;
}

const ChapterCard = ({
  id,
  title,
  completed,
  createdAt,
  onCompleteChange,
}: ChapterCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      await onCompleteChange(id, !completed);
    } catch (error) {
      console.error("Error updating completion status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-xs mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105'>
      <div className='relative'>
        <Image
          src={
            completed
              ? "https://i.pinimg.com/originals/50/08/19/5008199e83133fd884116ca38d3b548e.jpg"
              : "https://indianmemetemplates.com/wp-content/uploads/jethalal-headache.jpg"
          }
          alt={completed ? "Completed" : "Incomplete"}
          className='w-full h-40 object-cover'
          width={400}
          height={160}
          priority
        />
        <CardHeader className='absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full p-3'>
          <CardTitle className='text-white font-bold text-lg capitalize'>
            {title}
          </CardTitle>
        </CardHeader>
      </div>
      <CardContent className='p-3'>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
          Status: {completed ? "Completed" : "Not Completed"}
        </p>
        <Button
          variant={completed ? "outline" : "default"}
          onClick={handleButtonClick}
          className={`w-full py-1 text-white ${
            completed ? "bg-gray-500" : "bg-orange-500"
          } flex items-center justify-center`}
          disabled={loading}
        >
          {loading ? (
            <Disc3Icon size={18} className='animate-spin' />
          ) : completed ? (
            "Undo"
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChapterCard;
