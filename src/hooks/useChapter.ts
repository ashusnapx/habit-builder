import { useState, useEffect, useCallback } from "react";
import { fetchChapters, updateChapterCompletion } from "@/lib/appwrite";

export const useChapters = (subjectId: string) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getChapters = useCallback(async () => {
    setLoading(true);
    try {
      const chapters = await fetchChapters(subjectId);
      setChapters(chapters);
    } catch (error) {
      setError("Error loading chapters");
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    if (subjectId) {
      getChapters();
    }
  }, [subjectId, getChapters]);

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
