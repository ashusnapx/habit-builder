"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import CreateModal from "./CreateModal";
import { ModeToggle } from "./ModeToggle";
import { Github, LogOutIcon, Menu, PlusIcon, X } from "lucide-react";
import { account, fetchSubjects, signOut } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";
import Link from "next/link";

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const user = useFetchUser();

  useEffect(() => {
    console.log("Fetched user:", user);
  }, [user]);

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

  const handleSubjectCreated = (newSubject: any) => {
    fetchSubjects().then((subjects) => {
      console.log("Updated subjects:", subjects);
    });
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <header className='fixed top-0 left-0 w-full z-50 bg-white dark:bg-black shadow-lg capitalize'>
      <div className='flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between w-full md:w-auto space-x-4'>
          <Link
            href='/'
            className='text-2xl font-bold text-gray-900 dark:text-white'
          >
            Habit.AI
          </Link>
          <span className='text-sm text-gray-600 dark:text-gray-400 hidden md:inline'>
            By Ashutosh Kumar
          </span>

          <button
            onClick={toggleMenu}
            className='md:hidden text-gray-600 dark:text-gray-400 focus:outline-none'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav
          className={`fixed md:static inset-0 top-16 left-0 md:flex md:items-center md:space-x-6 md:top-0 md:inset-auto ${
            isMenuOpen
              ? "block bg-white dark:bg-black md:bg-transparent md:flex"
              : "hidden"
          } md:block`}
        >
          <div className='text-base text-center font-semibold text-gray-900 dark:text-white mt-4 md:mt-0'>
            Welcome {user?.user?.name || "Guest"}
          </div>
          <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0 gap-3'>
            {isAuthenticated ? (
              <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
                <Button
                  onClick={openModal}
                  className='flex items-center space-x-2 md:space-x-1'
                >
                  <PlusIcon size={18} />
                  <span>Create</span>
                </Button>
                <Button
                  onClick={handleSignOut}
                  className='flex items-center space-x-2 md:space-x-1'
                >
                  <LogOutIcon size={18} />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
                <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
                <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
              </div>
            )}
            <Link
              href=''
              className='flex items-center space-x-2 md:space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            >
              <Github size={18} />
              <span>Github</span>
            </Link>
            <ModeToggle />
          </div>
        </nav>
      </div>
      <CreateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubjectCreated={handleSubjectCreated}
      />
    </header>
  );
};

export default Navbar;
