"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import CreateModal from "./CreateModal";
import { ModeToggle } from "./ModeToggle";
import {
  Github,
  LockKeyholeIcon,
  LogOutIcon,
  Menu,
  PlusIcon,
  X,
} from "lucide-react";
import { account, signOut } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";
import { fetchSubjects } from "@/lib/appwrite"; // Ensure this import is correct
import Link from "next/link";

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const user = useFetchUser();

  useEffect(() => {
    console.log("Fetched user:", user); // Log the fetched user data
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
    // Fetch updated subjects after creating a new one
    fetchSubjects().then((subjects) => {
      console.log("Updated subjects:", subjects);
    });
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <div className='flex flex-col md:flex-row items-center justify-between p-3 border-b-2 relative'>
      <div className='flex items-center justify-between w-full md:w-auto'>
        <div className="flex flex-col mt-0 tracking-tighter">
          <Link href='/' className='text-3xl font-bold tracking-tighter'>
            Habit.AI
          </Link>
          <h1>By Ashutosh Kumar</h1>
        </div>
        <button onClick={toggleMenu} className='md:hidden'>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div
        className={`flex-col md:flex-row md:flex items-center ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        {/* Display the user's name */}
        <div className='text-xl font-semibold mr-9 capitalize'>
          Welcome {user?.user?.name ? user.user.name : "Guest"}
        </div>
        <div className='flex flex-row items-center justify-between gap-3 mt-2 md:mt-0'>
          {isAuthenticated ? (
            <>
              <Button onClick={openModal}>
                Create <PlusIcon className='ml-2 h-4 w-4' />
              </Button>
              <Button onClick={handleSignOut}>
                Sign Out
                <LogOutIcon className='ml-2 h-4 w-4' />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
              <Button onClick={() => router.push("/sign-up")}>Sign Up</Button>
            </>
          )}
          <Link href="" className="hover:text-blue-800">
            Github
            <Github className='ml-2 h-4 w-4 inline-block' />
          </Link>
          <ModeToggle />
        </div>
      </div>
      <CreateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubjectCreated={handleSubjectCreated}
      />
    </div>
  );
};

export default Navbar;
