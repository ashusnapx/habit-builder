"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import CreateModal from "./CreateModal";
import { ModeToggle } from "./ModeToggle";
import { Menu, X } from "lucide-react";
import { account, signOut } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const user = useFetchUser();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const checkAuthentication = async () => {
    try {
      const session = await account.getSession("current");
      setIsAuthenticated(!!session);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className='flex flex-col md:flex-row items-center justify-between p-3 border-b-2 relative'>
      <div className='flex items-center justify-between w-full md:w-auto'>
        <div className='text-xl font-bold'>HabitBuilder.AI</div>
        <button onClick={toggleMenu} className='md:hidden'>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div
        className={`flex-col md:flex-row md:flex items-center ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className='text-xl font-semibold mr-9'>Building habit takes time! {user.user}</div>
        <div className='flex flex-row items-center justify-between gap-5 mt-2 md:mt-0'>
          {isAuthenticated ? (
            <>
              <Button onClick={openModal}>Create</Button>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
              <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
            </>
          )}
          <div>Contact Us</div>
          <ModeToggle />
        </div>
      </div>
      <CreateModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Navbar;
