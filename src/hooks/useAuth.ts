import { useState, useEffect, useCallback } from "react";
import { account } from "@/lib/appwrite";

/**
 * Custom hook to handle authentication state across the application
 * @returns {Object} Authentication state and management functions
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthentication = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await account.getSession("current");
      setIsAuthenticated(!!session);
    } catch (error) {
      setIsAuthenticated(false);
      setError("Authentication check failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return {
    isAuthenticated,
    isLoading,
    error,
    refreshAuth: checkAuthentication,
  };
};
