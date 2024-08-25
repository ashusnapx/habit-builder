import { useState, useCallback } from "react";
import { appwriteConfig, database, getCurrentUserId } from "@/lib/appwrite";

export const useSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<any | null>(null);

  // Fetch a subject by its ID
  const fetchSubject = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        id
      );
      setSubject(response);
      return response;
    } catch (error) {
      setError("Failed to fetch subject.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new subject
  const createSubject = async (title: string) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const userId = await getCurrentUserId(); // Fetch user ID from Appwrite

      await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        "unique()",
        {
          title,
          createdAt: now,
          updatedAt: now,
          user: userId,
        }
      );
    } catch (error) {
      setError("Failed to create subject.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing subject
  const updateSubject = async (id: string, updates: { title?: string }) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();

      await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        id,
        {
          ...updates,
          updatedAt: now,
        }
      );
    } catch (error) {
      setError("Failed to update subject.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a subject by its ID
  const deleteSubject = async (id: string) => {
    setLoading(true);
    try {
      await database.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        id
      );
    } catch (error) {
      setError("Failed to delete subject.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSubject,
    updateSubject,
    deleteSubject,
    fetchSubject,
    subject,
    loading,
    error,
  };
};
