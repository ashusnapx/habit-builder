import { useState, useCallback } from "react";
import { signIn as appwriteSignIn } from "@/lib/appwrite";

interface SignInResponse {
  success: boolean;
  data?: any;
  errorCode?: number;
}

/**
 * Custom hook to manage user sign-in functionality
 * @returns {Object} Sign-in function and associated state
 */
export const useSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResponse> => {
      if (!email || !password) {
        setError("Email and password are required");
        return { success: false, errorCode: 400 };
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await appwriteSignIn(email, password);
        setSuccess("Sign in successful");
        return { success: true, data: response };
      } catch (err: any) {
        const errorMessage =
          err.message || "Sign in failed. Please check your credentials.";
        const errorCode = err.code || 500;

        console.error("Sign in error:", err);
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
    signIn,
    error,
    success,
    loading,
    resetState,
  };
};
