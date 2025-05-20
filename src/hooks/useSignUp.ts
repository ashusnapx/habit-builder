import { useState, useCallback } from "react";
import {
  signUp as appwriteSignUp,
  database,
  appwriteConfig,
} from "@/lib/appwrite";

interface SignUpResponse {
  success: boolean;
  errorCode?: number;
  userId?: string;
}

/**
 * Custom hook to manage user registration functionality
 * @returns {Object} Sign-up function and associated state
 */
export const useSignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string
    ): Promise<SignUpResponse> => {
      // Input validation
      if (!email || !password || !name) {
        setError("All fields are required");
        return { success: false, errorCode: 400 };
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        // Create user account in Appwrite
        const user = await appwriteSignUp(email, password, name);

        // Add user to the database collection matching the exact schema
        await database.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          {
            name,
            email,
            password: "SECURE", // 6-character placeholder within the 8-char limit
            subject: [], // Empty array for the relationship field
          }
        );

        setSuccess("Sign up successful!");
        return { success: true, userId: user.$id };
      } catch (err: any) {
        const errorMessage = err.message || "Sign up failed. Please try again.";
        const errorCode = err.code || 500;

        console.error("Sign up error:", err);
        setError(errorMessage);

        return { success: false, errorCode };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    signUp,
    error,
    success,
    loading,
    resetState,
  };
};
