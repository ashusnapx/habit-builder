import { useState, useCallback } from "react";
import { createChapter } from "@/lib/appwrite";

interface CreateChapterError extends Error {
  code?: number;
}

/**
 * Custom hook to manage the creation of new chapters
 * @returns {Object} Functions and state for chapter creation
 */
export const useCreateChapter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<CreateChapterError | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const addChapter = useCallback(async (subjectId: string, title: string) => {
    if (!subjectId || !title.trim()) {
      setError(new Error("Subject ID and title are required"));
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createChapter(subjectId, title.trim());
      setSuccess(true);
      return true;
    } catch (err) {
      const error = err as CreateChapterError;
      console.error("Error creating chapter:", error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    addChapter,
    loading,
    error,
    success,
    resetState,
  };
};
