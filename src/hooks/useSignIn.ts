import { useState } from "react";
import { signIn as appwriteSignIn } from "@/lib/appwrite";
import { v4 as uuidv4 } from "uuid";

export const useSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const userId = uuidv4();

  const signIn = async (email: string, password: string) => {
    try {
      await appwriteSignIn(userId, email, password);
      setSuccess("Sign in successful!");
      setError(null);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.message || "Sign in failed. Please check your credentials.";
      setError(errorMessage);
      setSuccess(null);
      return { success: false };
    }
  };

  return { signIn, error, success };
};
