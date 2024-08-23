import { useState } from "react";
import {
  signUp as appwriteSignUp,
  database,
  appwriteConfig,
} from "@/lib/appwrite";

export const useSignUp = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Create user account in Appwrite
      const user = await appwriteSignUp(email, password, name);

      // Add user to the database collection
      await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,
        { name, email, password }
      );

      setSuccess("Sign up successful!");
      setError(null);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Sign up failed. Please try again.";
      setError(errorMessage);
      setSuccess(null);
      return { success: false };
    }
  };

  return { signUp, error, success };
};
