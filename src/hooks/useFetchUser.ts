import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";

export const useFetchUser = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
        setError(null);
      } catch (err) {
        setError("Failed to fetch user details.");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return { user, error };
};
