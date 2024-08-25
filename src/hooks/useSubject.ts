import { useState } from "react";
import { database, appwriteConfig } from "@/lib/appwrite";
import { useFetchUser } from "@/hooks/useFetchUser";

export const useSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<any | null>(null);
  const { user } = useFetchUser(); 

  const createSubject = async (title: string) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not found.");
      }
      const now = new Date().toISOString();

      await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.subjectCollectionId,
        "unique()",
        {
          title,
          createdAt: now,
          updatedAt: now,
          user: user.$id,
        }
      );
    } catch (error) {
      setError("Failed to create subject.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

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

  // Function to fetch a subject by its ID
  const fetchSubject = async (id: string) => {
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
