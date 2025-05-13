import { useState, useEffect, useCallback } from "react";
import { fetchChapters, updateChapterCompletion } from "@/lib/appwrite";

interface Chapter {
  $id: string;
  title: string;
  completed: boolean;
  progress: number;
  createdAt: string;
  subject: string;
}

/**
 * Custom hook to manage chapter data for a specific subject
 * @param {string} subjectId - The ID of the subject to fetch chapters for
 * @returns {Object} Chapter data and management functions
 */
export const useChapters = (subjectId: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getChapters = useCallback(async () => {
    if (!subjectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedChapters = await fetchChapters(subjectId);

      // Ensure each chapter has createdAt as a standardized ISO string
      const chaptersWithDates = fetchedChapters.map((chapter) => ({
        ...chapter,
        createdAt: new Date(chapter.createdAt).toISOString(),
      }));

      setChapters(chaptersWithDates);
    } catch (error) {
      console.error("Failed to load chapters:", error);
      setError("Error loading chapters. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    getChapters();
  }, [getChapters]);

  const handleCompleteChange = useCallback(
    async (id: string, completed: boolean) => {
      try {
        await updateChapterCompletion(id, completed);

        setChapters((prevChapters) =>
          prevChapters.map((chapter) =>
            chapter.$id === id
              ? {
                  ...chapter,
                  completed,
                  progress: completed ? 100 : chapter.progress,
                }
              : chapter
          )
        );
      } catch (error) {
        console.error("Error updating chapter completion:", error);
        setError("Failed to update chapter status. Please try again.");
      }
    },
    []
  );

  return {
    chapters,
    loading,
    error,
    handleCompleteChange,
    refetchChapters: getChapters,
  };
};
