import { useState, useEffect } from "react";
import { fetchSubjects as appwriteFetchSubjects } from "@/lib/appwrite";

export const useFetchSubjects = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await appwriteFetchSubjects();
        setSubjects(subjects);
        setError(null);
      } catch (err) {
        setError("Failed to fetch subjects.");
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  return { subjects, error };
};
