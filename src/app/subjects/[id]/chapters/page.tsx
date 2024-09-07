"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapters, useCreateChapter, useSubject } from "@/hooks";
import ChapterCard from "@/components/ChapterCard";
import { motion, AnimatePresence } from "framer-motion";

const ChaptersPage = () => {
  const { id: subjectIdParam } = useParams();
  const subjectId = Array.isArray(subjectIdParam)
    ? subjectIdParam[0]
    : subjectIdParam;
  const { chapters, loading, error, handleCompleteChange, refetchChapters } =
    useChapters(subjectId as string);
  const {
    addChapter,
    loading: addLoading,
    error: addError,
  } = useCreateChapter();
  const { fetchSubject } = useSubject();
  const [newChapters, setNewChapters] = useState("");
  const { width, height } = useWindowSize();
  const [isConfettiActive, setConfettiActive] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const allChaptersCompleted = chapters.every((chapter) => chapter.completed);
    if (allChaptersCompleted && chapters.length > 0) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000);
    }

    // Calculate percentage completion
    const completedCount = chapters.filter(
      (chapter) => chapter.completed
    ).length;
    const totalCount = chapters.length;
    const newCompletionPercentage =
      totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    setCompletionPercentage(newCompletionPercentage);
  }, [chapters]);

  useEffect(() => {
    const fetchSubjectTitle = async () => {
      if (subjectId) {
        try {
          const subjectData = await fetchSubject(subjectId);
          setSubjectTitle(subjectData.title);
        } catch (error) {
          console.error("Error fetching subject title:", error);
        }
      }
    };
    fetchSubjectTitle();
  }, [subjectId, fetchSubject]);

  const handleAddChapter = async () => {
    if (subjectId && newChapters.trim()) {
      try {
        const titles = newChapters
          .split(",")
          .map((title) => title.trim())
          .filter((title) => title.length > 0);
        await Promise.all(titles.map((title) => addChapter(subjectId, title)));
        setNewChapters("");
        refetchChapters();
      } catch (err) {
        console.error("Failed to add chapters:", err);
      }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.9 },
  };

  const progressBarVariants = {
    initial: { width: 0 },
    animate: { width: `${completionPercentage}%` },
  };

  const MotionButton = motion(Button);

  if (loading) {
    return (
      <motion.div
        initial='initial'
        animate='in'
        exit='out'
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className='relative p-5 mt-20 dark:bg-gray-900 dark:text-gray-100'
      >
        {isConfettiActive && <Confetti width={width} height={height} />}
        <h1 className='text-4xl font-extrabold mb-4 text-gray-600 dark:text-gray-300'>
          Chapters
        </h1>
        <p className='text-lg text-gray-600 mb-4 dark:text-gray-400'>
          Loading chapters...
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='p-4 border border-gray-200 rounded-lg shadow-md bg-white dark:border-gray-700 dark:bg-gray-800'
              >
                <Skeleton className='h-12 w-12 rounded-full mb-4 dark:bg-gray-600' />
                <div className='space-y-4'>
                  <Skeleton className='h-4 w-[250px] dark:bg-gray-600' />
                  <Skeleton className='h-4 w-[200px] dark:bg-gray-600' />
                  <Skeleton className='h-4 w-[150px] dark:bg-gray-600' />
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial='initial'
        animate='in'
        exit='out'
        variants={pageVariants}
        transition={{ duration: 0.5 }}
        className='relative p-5 mt-20'
      >
        {isConfettiActive && <Confetti width={width} height={height} />}
        <h1 className='text-4xl font-extrabold mb-4 text-gray-900'>Chapters</h1>
        <p className='text-lg text-red-600'>Error loading chapters: {error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial='initial'
      animate='in'
      exit='out'
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className='relative p-5 mt-20'
    >
      {isConfettiActive && <Confetti width={width} height={height} />}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='text-4xl font-extrabold mb-4 text-blue-600 dark:text-gray-200 tracking-tighter flex-wrap overflow-x-hidden capitalize'
      >
        {subjectTitle} Chapters 📕
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='mb-4 bg-gray-200 rounded-full dark:bg-gray-700'
      >
        <motion.div
          className='bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
          style={{ width: `${completionPercentage}%` }}
          variants={progressBarVariants}
          initial='initial'
          animate='animate'
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {completionPercentage.toFixed(2)}%
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='flex flex-col md:flex-row items-center gap-4 mb-6'
      >
        <Input
          value={newChapters}
          onChange={(e) => setNewChapters(e.target.value)}
          placeholder='Enter chapter titles separated by commas'
          className='flex-1 border border-gray-300 rounded-lg p-2 shadow-sm'
        />
        <MotionButton
          onClick={handleAddChapter}
          disabled={addLoading || newChapters.trim() === ""}
          className='bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {addLoading ? "Adding..." : "Add Chapters"}
        </MotionButton>
        {addError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='text-red-600 mt-2'
          >
            Error adding chapters: {addError.message}
          </motion.p>
        )}
      </motion.div>
      <AnimatePresence>
        <motion.div
          initial='initial'
          animate='in'
          exit='out'
          variants={cardVariants}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {[...chapters].reverse().map((chapter, index) => (
            <motion.div
              key={chapter.$id}
              variants={cardVariants}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <ChapterCard
                id={chapter.$id}
                title={chapter.title}
                completed={chapter.completed}
                onCompleteChange={handleCompleteChange}
                createdAt={chapter.createdAt}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ChaptersPage;
