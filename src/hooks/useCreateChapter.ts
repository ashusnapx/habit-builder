"use client";

import { useState } from "react";
import { createChapter } from "@/lib/appwrite"; // Import the createChapter function

export const useCreateChapter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addChapter = async (subjectId: string, title: string) => {
    setLoading(true);
    setError(null);
    try {
      await createChapter(subjectId, title);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { addChapter, loading, error };
};
