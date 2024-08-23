import { useState } from "react";
import { signOut as appwriteSignOut } from "@/lib/appwrite";

export const useSignOut = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const signOut = async () => {
    try {
      await appwriteSignOut();
      setSuccess("Sign out successful!");
      setError(null);
    } catch (err) {
      setError("Sign out failed. Please try again.");
      setSuccess(null);
    }
  };

  return { signOut, error, success };
};
