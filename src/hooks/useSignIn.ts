import { useState } from "react";
import { signIn as appwriteSignIn } from "@/lib/appwrite";

export const useSignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await appwriteSignIn(email, password);
      console.log("Appwrite signIn response:", response);
      setSuccess("Sign in successful!");
      setError(null);
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage =
        err.message || "Sign in failed. Please check your credentials.";
      console.log("Sign in error:", err);
      setError(errorMessage);
      setSuccess(null);
      return { success: false };
    }
  };

  return { signIn, error, success };
};
