import { useState } from "react";
import { database, appwriteConfig } from "@/lib/appwrite"; // Ensure this import path is correct
import { useFetchUser } from "@/hooks/useFetchUser"; // Import your fetch user hook

export const useSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useFetchUser(); // Get current user

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
          user: user.$id, // Use the fetched user ID
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

  return { createSubject, updateSubject, deleteSubject, loading, error };
};
