import { useState, useCallback } from "react";
import { appwriteConfig, database, getCurrentUserId } from "@/lib/appwrite";

interface SubjectData {
  $id?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  user?: string;
}

/**
 * Custom hook to manage subject data operations
 * @returns {Object} Subject operations and state
 */
export const useSubject = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<SubjectData | null>(null);

  // Fetch a subject by its ID
  const fetchSubject = useCallback(async (id: string) => {
    if (!id) {
      setError("Subject ID is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        id
      );
      // @ts-ignore
      setSubject(response);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to fetch subject";
      console.error(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new subject
  const createSubject = useCallback(async (title: string) => {
    if (!title.trim()) {
      setError("Subject title is required");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const userId = await getCurrentUserId();

      const response = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        "unique()",
        {
          title: title.trim(),
          createdAt: now,
          updatedAt: now,
          user: userId,
        }
      );

      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create subject";
      console.error(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing subject
  const updateSubject = useCallback(
    async (id: string, updates: { title?: string }) => {
      if (!id) {
        setError("Subject ID is required");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const now = new Date().toISOString();

        const response = await database.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.subjectCollectionId,
          id,
          {
            ...updates,
            updatedAt: now,
          }
        );

        // Update local state if we're holding this subject
        if (subject && subject.$id === id) {
          setSubject({
            ...subject,
            ...updates,
            updatedAt: now,
          });
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to update subject";
        console.error(errorMessage, error);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [subject]
  );

  // Delete a subject by its ID
  const deleteSubject = useCallback(
    async (id: string) => {
      if (!id) {
        setError("Subject ID is required");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await database.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.subjectCollectionId,
          id
        );

        // Clear local state if we're holding this subject
        if (subject && subject.$id === id) {
          setSubject(null);
        }

        return true;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to delete subject";
        console.error(errorMessage, error);
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [subject]
  );

  const resetState = useCallback(() => {
    setError(null);
    setSubject(null);
  }, []);

  return {
    createSubject,
    updateSubject,
    deleteSubject,
    fetchSubject,
    subject,
    loading,
    error,
    resetState,
  };
};
