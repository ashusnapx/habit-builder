import { useState, useEffect } from "react";
import { fetchChapters, updateChapterCompletion } from "@/lib/appwrite";

export const useChapters = (subjectId: string) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getChapters = async () => {
      try {
        const chapters = await fetchChapters(subjectId);
        setChapters(chapters);
      } catch (error) {
        setError("Error loading chapters");
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      getChapters();
    }
  }, [subjectId]);

  const handleCompleteChange = async (id: string, completed: boolean) => {
    try {
      await updateChapterCompletion(id, completed);
      const updatedChapters = chapters.map((chapter) =>
        chapter.$id === id
          ? {
              ...chapter,
              completed,
              progress: completed ? 100 : chapter.progress,
            }
          : chapter
      );
      setChapters(updatedChapters);
    } catch (error) {
      console.error("Error updating chapter completion:", error);
    }
  };

  return {
    chapters,
    loading,
    error,
    handleCompleteChange,
  };
};
