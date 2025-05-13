import { useState, useEffect, useCallback } from "react";
import { account } from "@/lib/appwrite";

interface User {
  $id: string;
  name: string;
  email: string;
  registration: string;
  status: boolean;
}

/**
 * Custom hook to fetch and manage the current user's data
 * @returns {Object} User data, loading state, error state, and refresh function
 */
export const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await account.get();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setError("Failed to fetch user details. Please try again later.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    user,
    loading,
    error,
    refetchUser: fetchUserData,
  };
};
