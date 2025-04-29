"use client";
import React, { useState, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChapterCardProps {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  onCompleteChange: (id: string, newStatus: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ChapterCard: React.FC<ChapterCardProps> = ({
  id,
  title,
  completed,
  createdAt,
  onCompleteChange,
  onDelete,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleCompleteClick = useCallback(async () => {
    setLoading(true);
    try {
      await onCompleteChange(id, !completed);
    } catch (error) {
      console.error("Error updating completion status:", error);
    } finally {
      setLoading(false);
    }
  }, [id, completed, onCompleteChange]);

  const handleDeleteClick = useCallback(async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
      return;
    }

    setDeleting(true);
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    } finally {
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  }, [id, onDelete, showConfirmDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowConfirmDelete(false);
  }, []);

  const cardBackgroundClass = completed
    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40"
    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800";

  const cardImages = {
    completed:
      "https://i.pinimg.com/originals/50/08/19/5008199e83133fd884116ca38d3b548e.jpg",
    incomplete:
      "https://indianmemetemplates.com/wp-content/uploads/jethalal-headache.jpg",
  };

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='h-full'
      >
        <Card
          className={`w-full h-full flex flex-col shadow-md rounded-lg overflow-hidden transition-all duration-300 ${cardBackgroundClass}`}
        >
          <div className='relative'>
            <div className='relative w-full h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden'>
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  completed
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-amber-50 dark:bg-amber-900/20"
                }`}
              >
                {completed ? (
                  <CheckCircle className='w-16 h-16 text-blue-500 dark:text-blue-400 opacity-30' />
                ) : (
                  <Clock className='w-16 h-16 text-amber-500 dark:text-amber-400 opacity-30' />
                )}
              </div>

              <Badge
                className={`absolute top-2 right-2 ${
                  completed
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {completed ? "Completed" : "In Progress"}
              </Badge>
            </div>

            <CardHeader className='absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-3'>
              <CardTitle className='text-white font-bold text-lg capitalize truncate'>
                {title}
              </CardTitle>
            </CardHeader>
          </div>

          <CardContent className='p-4 flex-grow flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-center mb-3'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Created: {formattedDate}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant='outline' className='text-xs'>
                      {daysElapsed} {daysElapsed === 1 ? "day" : "days"} ago
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created on {new Date(createdAt).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className='w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4'>
                <motion.div
                  className={`h-1.5 rounded-full ${
                    completed ? "bg-green-500" : "bg-amber-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: completed ? "100%" : "20%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className='flex gap-2 mt-2'>
              <Button
                variant={completed ? "outline" : "default"}
                onClick={handleCompleteClick}
                className={`flex-1 py-1 flex items-center justify-center ${
                  completed
                    ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={18} className='animate-spin mr-1' />
                ) : completed ? (
                  <>
                    <XCircle size={18} className='mr-1' />
                    Undo
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className='mr-1' />
                    Complete
                  </>
                )}
              </Button>

              {showConfirmDelete ? (
                <div className='flex gap-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={handleDeleteClick}
                        disabled={deleting}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        {deleting ? (
                          <Loader2 size={16} className='animate-spin' />
                        ) : (
                          "Yes"
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Confirm deletion</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleCancelDelete}
                        className='border-gray-300 dark:border-gray-700'
                      >
                        No
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel deletion</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      onClick={handleDeleteClick}
                      className='py-1 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
                      disabled={deleting}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete chapter</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default memo(ChapterCard);
