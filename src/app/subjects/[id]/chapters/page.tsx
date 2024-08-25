"use client";

import { useState } from "react";

import { Github, LogOutIcon, Menu, PlusIcon, X } from "lucide-react";
import { signOut } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; 
import { Button } from "@/components/ui/button";
import TargetModal from "@/components/TargetModal";
import { CreateModal, ModeToggle } from "@/components";

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuth(); 
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
    closeModal();
  };

  const handleSignUp = () => {
    router.push("/sign-up");
    closeModal();
  };

  const handleSubjectCreated = (newSubject: any) => {
    // Handle subject creation
  };

  return (
    <header className='fixed top-0 left-0 w-full z-50 bg-white dark:bg-black shadow-lg capitalize'>
      <div className='flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between w-full md:w-auto space-x-4'>
          <Link
            href='/'
            className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex flex-col'
          >
            <h1>
              Habit.<span className='text-blue-600 italic'>AI</span>
            </h1>
            <span className='text-sm font-normal text-gray-600 dark:text-gray-400'>
              By Ashutosh Kumar
            </span>
          </Link>

          <Button
            variant='outline'
            onClick={toggleMenu}
            className='md:hidden text-gray-600 dark:text-gray-400 focus:outline-none'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        <nav
          className={`fixed md:static inset-0 top-16 left-0 md:flex md:items-center md:space-x-6 md:top-0 md:inset-auto ${
            isMenuOpen
              ? "block bg-white dark:bg-black md:bg-transparent md:flex"
              : "hidden"
          } md:block`}
        >
          <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0 gap-3'>
            {isAuthenticated ? (
              <div className='flex flex-col md:flex-row gap-2 md:gap-2 w-fit'>
                <TargetModal />
                <Button
                  onClick={openModal}
                  className='flex items-center space-x-2 md:space-x-1'
                  variant='outline'
                >
                  <PlusIcon size={18} />
                  <span>Create</span>
                </Button>
                <Button
                  onClick={handleSignOut}
                  className='flex items-center space-x-2 md:space-x-1 hover:bg-red-500 hover:text-white'
                  variant='outline'
                >
                  <LogOutIcon size={18} />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className='flex flex-col md:flex-row gap-2 md:gap-4'>
                <Button onClick={handleSignIn}>Sign In</Button>
                <Button onClick={handleSignUp}>Sign Up</Button>
              </div>
            )}
            <Link
              href='https://ashusnapx.vercel.app/'
              className='flex items-center space-x-2 md:space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              target='_blank'
            >
              <Github size={18} />
              <span>Github</span>
            </Link>
            <div>
              <ModeToggle />
            </div>
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
