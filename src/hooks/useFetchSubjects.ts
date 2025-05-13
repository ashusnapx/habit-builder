import { useState, useEffect, useCallback } from "react";
import { fetchSubjects as appwriteFetchSubjects } from "@/lib/appwrite";

interface Subject {
  $id: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  lastOpened?: Date;
  user: string;
}

/**
 * Custom hook to fetch and manage subject data
 * @returns {Object} Subject data, loading state, error state, and refresh function
 */
export const useFetchSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjectsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedSubjects = await appwriteFetchSubjects();

      // Process dates to ensure they're proper Date objects
      const subjectsWithDates = fetchedSubjects.map((subject) => ({
        ...subject,
        lastOpened: subject.lastOpened
          ? new Date(subject.lastOpened)
          : new Date(0),
        createdAt: subject.createdAt
          ? new Date(subject.createdAt)
          : new Date(0),
        updatedAt: subject.updatedAt ? new Date(subject.updatedAt) : undefined,
      }));
      // @ts-ignore
      setSubjects(subjectsWithDates);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError("Failed to fetch subjects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjectsData();
  }, [fetchSubjectsData]);

  return {
    subjects,
    loading,
    error,
    refetchSubjects: fetchSubjectsData,
  };
};
