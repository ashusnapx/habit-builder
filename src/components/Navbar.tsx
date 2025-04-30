"use client";

/**
 * Navbar.tsx
 *
 * A responsive navigation component that serves as the primary navigation interface
 * for the Habit.AI application. Features authentication state management,
 * responsive design, theme toggling, and modal controls.
 *
 * @author Original: Ashutosh Kumar
 * @version 2.0.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  LogOutIcon,
  Menu,
  PlusIcon,
  X,
  UserIcon,
  HomeIcon,
  BarChartIcon,
  Settings,
} from "lucide-react";

// UI Components
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";

// Modals
import CreateModal from "./CreateModal";
import TargetModal from "./TargetModal";

// Backend services
import { account, fetchSubjects, signOut } from "@/lib/appwrite";
import { useFetchUser } from "@/hooks/useFetchUser";

// Analytics provider
// Types
interface Subject {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
}

type ModalType = "create" | "target" | null;

/**
 * Navbar Component
 *
 * Main navigation interface containing authentication controls,
 * theme toggle, and access to main application features.
 */
const Navbar: React.FC = () => {
  // State management
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hooks
  const router = useRouter();
  const { user, error } = useFetchUser();
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Opens a specific modal type
   * @param modalType - The type of modal to open
   */
  const openModal = useCallback((modalType: ModalType) => {
    setActiveModal(modalType);
    // Track event if analytics implemented in the future
  }, []);

  /**
   * Closes the currently active modal
   */
  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  /**
   * Toggles the mobile navigation menu
   */
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  /**
   * Verifies the user's authentication status
   */
  const checkAuthentication = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await account.getSession("current");
      setIsAuthenticated(!!session);
      // Analytics tracking could be added here in the future
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles user sign out process
   */
  const handleSignOut = useCallback(async () => {
    try {
      // Analytics tracking could be added here in the future
      await signOut();
      setIsAuthenticated(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      // Implement proper error handling/notification here
    }
  }, [router]);

  /**
   * Redirects to sign in page
   */
  const handleSignIn = useCallback(() => {
    // Analytics tracking could be added here in the future
    router.push("/sign-in");
    closeModal();
  }, [router, closeModal]);

  /**
   * Redirects to sign up page
   */
  const handleSignUp = useCallback(() => {
    // Analytics tracking could be added here in the future
    router.push("/sign-up");
    closeModal();
  }, [router, closeModal]);

  /**
   * Callback for when new subjects are created
   * @param newSubjects - The newly created subjects data
   */
  const handleSubjectCreated = useCallback(
    (newSubjects: any[]) => {
      fetchSubjects().then((subjects) => {
        // Analytics tracking could be added here in the future
        closeModal();
      });
    },
    [closeModal]
  );

  /**
   * Generate appropriate greeting based on time of day
   */
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Check authentication on component mount and user state change
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication, user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <header className='fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between py-3 px-4 md:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800'>
        {/* Logo and Brand */}
        <div className='flex items-center justify-between w-full md:w-auto'>
          <Link
            href='/'
            className='group flex flex-col items-start transition-all duration-300'
          >
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center'>
              Habit.
              <span className='text-blue-600 dark:text-blue-400 italic group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors'>
                AI
              </span>
            </h1>
            <span className='text-sm font-normal text-gray-600 dark:text-gray-400 transition-opacity duration-300 opacity-80 group-hover:opacity-100'>
              By Ashutosh Kumar
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleMenu}
            className='md:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 rounded-md'
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={24} className='text-red-500 dark:text-red-400' />
            ) : (
              <Menu size={24} />
            )}
          </Button>
        </div>

        {/* Desktop/Mobile Navigation */}
        <AnimatePresence>
          <motion.nav
            ref={menuRef}
            initial={false}
            animate={{ height: isMenuOpen ? "auto" : "0px" }}
            className={`md:h-auto w-full md:w-auto overflow-hidden md:overflow-visible ${
              isMenuOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-2 pb-4 md:pb-0 align-middle'>
              {/* Welcome message for authenticated users */}
              {/* {isAuthenticated && user && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='flex items-center mr-0 md:mr-4 mb-3 md:mb-0'
                >
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8 border border-gray-200 dark:border-gray-700'>
                      <AvatarImage
                        src={user.profileImage || ""}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className='hidden md:block'>
                      <p className='text-sm font-medium text-gray-800 dark:text-gray-200'>
                        {greeting},{" "}
                        <span className='font-semibold capitalize'>
                          {user.name?.split(" ")[0] || "User"}
                        </span>
                        !
                      </p>
                    </div>
                  </div>
                </motion.div>
              )} */}

              {/* Authentication Buttons */}
              {isLoading ? (
                <div className='flex gap-2 md:gap-4'>
                  <Skeleton className='h-10 w-20' />
                  <Skeleton className='h-10 w-20' />
                </div>
              ) : isAuthenticated ? (
                <div className='flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto'>
                  {/* Main Navigation Buttons for Authenticated Users */}
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href='/dashboard'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 w-full md:w-auto'
                          >
                            <HomeIcon size={16} />
                            <span className='md:hidden lg:inline'>
                              Dashboard
                            </span>
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className='hidden md:block lg:hidden'>
                        <p>Dashboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}

                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href='/analytics'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 w-full md:w-auto'
                          >
                            <BarChartIcon size={16} />
                            <span className='md:hidden lg:inline'>
                              Analytics
                            </span>
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className='hidden md:block lg:hidden'>
                        <p>Analytics</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            openModal("create");
                            setMenuOpen(false);
                          }}
                          size='sm'
                          className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full md:w-auto'
                        >
                          <PlusIcon size={16} />
                          <span className='md:hidden lg:inline'>
                            Create Habit
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className='hidden md:block lg:hidden'>
                        <p>Create Habit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border-gray-200 dark:border-gray-700 w-full md:w-auto'
                  >
                    <LogOutIcon size={16} />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className='flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto'>
                  <Button
                    onClick={() => {
                      handleSignIn();
                      setMenuOpen(false);
                    }}
                    variant='outline'
                    size='sm'
                    className='border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 w-full md:w-auto'
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignUp();
                      setMenuOpen(false);
                    }}
                    size='sm'
                    className='bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto'
                  >
                    Get Started
                  </Button>
                </div>
              )}

              {/* Theme Toggle and External Links */}
              <div className='flex items-center gap-3 mt-3 md:mt-0'>
                <Link
                  href='https://ashusnapx.vercel.app/'
                  className='flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setMenuOpen(false)}
                >
                  <Github size={16} />
                  <span className='md:hidden lg:inline'>Github</span>
                </Link>

                {/* Themed toggle with animation */}
                <div className='transition-all duration-300 hover:scale-105'>
                  <ModeToggle />
                </div>

                {/* New Feature Badge */}
                <Badge
                  variant='outline'
                  className='hidden md:flex text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                >
                  New
                </Badge>
              </div>
            </div>
          </motion.nav>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={activeModal === "create"}
        onClose={closeModal}
        onSubjectCreated={handleSubjectCreated}
      />

      {/* <TargetModal isOpen={activeModal === "target"} onClose={closeModal} /> */}
    </header>
  );
};

export default Navbar;
