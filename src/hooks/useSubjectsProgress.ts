// hooks/useSubjectsProgress.ts
import { useState, useEffect, ChangeEvent } from "react";
import { fetchSubjects, fetchChapters } from "@/lib/appwrite";

export const useSubjectsProgress = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [dailyTarget, setDailyTarget] = useState<number>(0);
  const [totalChapters, setTotalChapters] = useState<number>(0);
  const [completedChapters, setCompletedChapters] = useState<number>(0);

  const calculateDailyTarget = () => {
    if (targetDate && totalChapters > 0) {
      const today = new Date();
      const timeDiff = targetDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (daysRemaining > 0) {
        setDailyTarget(Math.ceil(totalChapters / daysRemaining));
      }
    }
  };

  const handleTargetDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    setTargetDate(date);
    calculateDailyTarget();
  };

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const subjectData = await fetchSubjects();
        let total = 0;
        let completed = 0;

        const subjectsWithProgress = await Promise.all(
          subjectData.map(async (subject) => {
            const chapterData = await fetchChapters(subject.$id);
            total += chapterData.length;
            completed += chapterData.filter(
              (chapter) => chapter.completed
            ).length;
            return {
              ...subject,
              completedChapters: chapterData.filter(
                (chapter) => chapter.completed
              ).length,
              totalChapters: chapterData.length,
            };
          })
        );

        setSubjects(subjectsWithProgress);
        setTotalChapters(total);
        setCompletedChapters(completed);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, []);

  return {
    subjects,
    loading,
    targetDate,
    dailyTarget,
    totalChapters,
    completedChapters,
    handleTargetDateChange,
  };
};
