"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChapterCard from "@/components/ChapterCard";
import { useChapters } from "@/hooks/useChapter";
import { useCreateChapter } from "@/hooks/useCreateChapter";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

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
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const { width, height } = useWindowSize();
  const [isConfettiActive, setConfettiActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const allChaptersCompleted = chapters.every((chapter) => chapter.completed);
    if (allChaptersCompleted && chapters.length > 0) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 5000); // Show confetti for 5 seconds
    }
  }, [chapters]);

  const handleAddChapter = async () => {
    if (subjectId) {
      try {
        await addChapter(subjectId, newChapterTitle);
        setNewChapterTitle("");
      } catch (err) {
        // Handle error silently
      }
    }
  };

  if (loading) {
    return (
      <div className='relative p-5 mt-20'>
        {/* Always render Confetti but control its visibility via isConfettiActive */}
        {isConfettiActive && <Confetti width={width} height={height} />}
        <h1 className='text-3xl font-bold mb-2'>Chapters</h1>
        <p>Loading chapters...</p>
        <div className='flex flex-col gap-4'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className='p-4 border rounded shadow'>
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
        {/* Always render Confetti but control its visibility via isConfettiActive */}
        {isConfettiActive && <Confetti width={width} height={height} />}
        <h1 className='text-3xl font-bold mb-2'>Chapters</h1>
        <p className='text-red-500'>Error loading chapters: {error}</p>
      </div>
    );
  }

  return (
    <div className='relative p-5 mt-20'>
      {/* Always render Confetti but control its visibility via isConfettiActive */}
      {isConfettiActive && <Confetti width={width} height={height} />}
      <h1 className='text-3xl font-bold mb-2'>Chapters</h1>
      <p>
        Time spent: {Math.floor(time / 60)}m {time % 60}s
      </p>
      <div className='flex flex-row items-center gap-5'>
        <Input
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder='New Chapter Title'
        />
        <Button onClick={handleAddChapter} disabled={addLoading}>
          {addLoading ? "Adding..." : "Add Chapter"}
        </Button>
        {addError && (
          <p className='text-red-500'>
            Error adding chapter: {addError.message}
          </p>
        )}
      </div>
      <div className='mt-4 flex flex-col md:flex-row gap-4'>
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
