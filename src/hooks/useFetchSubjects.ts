import { useState, useEffect } from "react";
import { fetchSubjects as appwriteFetchSubjects } from "@/lib/appwrite";

export const useFetchSubjects = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await appwriteFetchSubjects();

        // Ensure each subject has `lastOpened` as a Date object
        const subjectsWithDates = subjects.map((subject) => ({
          ...subject,
          lastOpened: new Date(subject.lastOpened || new Date(0)),
        }));

        setSubjects(subjectsWithDates);
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
