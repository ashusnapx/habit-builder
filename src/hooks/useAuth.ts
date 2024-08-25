import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const session = await account.getSession("current");
        setIsAuthenticated(!!session);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return isAuthenticated;
};
