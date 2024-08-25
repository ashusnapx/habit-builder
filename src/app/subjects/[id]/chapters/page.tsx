"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapters, useCreateChapter, useSubject } from "@/hooks";
import { ChapterCard } from "@/components";

const ChaptersPage = () => {
  const { id: subjectIdParam } = useParams();
  const subjectId = Array.isArray(subjectIdParam)
    ? subjectIdParam[0]
    : subjectIdParam;
  const { chapters, loading, error, handleCompleteChange } = useChapters(
    subjectId as string
  );
  const {
    addChapter,
    loading: addLoading,
    error: addError,
  } = useCreateChapter();
  const { fetchSubject } = useSubject();
  const [newChapters, setNewChapters] = useState("");
  const { width, height } = useWindowSize();
  const [isConfettiActive, setConfettiActive] = useState(false);
  const [time, setTime] = useState(0);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState<string | null>(null);

  useEffect(() => {
    const allChaptersCompleted = chapters.every((chapter) => chapter.completed);
    if (allChaptersCompleted && chapters.length > 0) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000); // Show confetti for 5 seconds
    }
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
        setButtonDisabled(true); // Disable button after click

        for (const title of titles) {
          await addChapter(subjectId, title);
        }

        setNewChapters("");
        // Reload the page or re-fetch data to reflect changes
        window.location.reload();
      } catch (err) {
        console.error("Failed to add chapters:", err);
      } finally {
        setButtonDisabled(false);
      }
    }
  };

  // Calculate percentage completion
  const completedCount = chapters.filter((chapter) => chapter.completed).length;
  const totalCount = chapters.length;
  const completionPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className='relative p-5 mt-20'>
        {isConfettiActive && <Confetti width={width} height={height} />}
        <h1 className='text-4xl font-extrabold mb-4 text-gray-600'>Chapters</h1>
        <p className='text-lg text-gray-600 mb-4'>Loading chapters...</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className='p-4 border border-gray-200 rounded-lg shadow-md bg-white'
              >
                <Skeleton className='h-12 w-12 rounded-full mb-4' />
                <div className='space-y-4'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                  <Skeleton className='h-4 w-[150px]' />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='relative p-5 mt-20'>
        {isConfettiActive && <Confetti width={width} height={height} />}
        <h1 className='text-4xl font-extrabold mb-4 text-gray-900'>Chapters</h1>
        <p className='text-lg text-red-600'>Error loading chapters: {error}</p>
      </div>
    );
  }

  return (
    <div className='relative p-5 mt-20'>
      {isConfettiActive && <Confetti width={width} height={height} />}
      <h1 className='text-4xl font-extrabold mb-4 text-blue-600 dark:text-gray-500 tracking-tighter flex-wrap overflow-x-hidden capitalize'>
        {subjectTitle} Chapters 📕
      </h1>
      <p className='text-lg mb-4'>
        Completion: {completionPercentage.toFixed(2)}%
      </p>
      <div className='flex flex-col md:flex-row items-center gap-4 mb-6'>
        <Input
          value={newChapters}
          onChange={(e) => setNewChapters(e.target.value)}
          placeholder='Enter chapter titles separated by commas'
          className='flex-1 border border-gray-300 rounded-lg p-2 shadow-sm'
        />
        <Button
          onClick={handleAddChapter}
          disabled={addLoading || newChapters.trim() === "" || isButtonDisabled}
          className='bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          {addLoading ? "Adding..." : "Add Chapters"}
        </Button>
        {addError && (
          <p className='text-red-600 mt-2'>
            Error adding chapters: {addError.message}
          </p>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {chapters.map((chapter) => (
          <ChapterCard
            key={chapter.$id}
            id={chapter.$id}
            title={chapter.title}
            completed={chapter.completed}
            onCompleteChange={handleCompleteChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ChaptersPage;
