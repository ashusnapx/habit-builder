"use client";

/**
 * Navbar.tsx
 *
 * A responsive navigation component that serves as the primary navigation interface
 * for the Habit.AI application. Features authentication state management,
 * responsive design, theme toggling, and modal controls.
 *
 * @author Original: Ashutosh Kumar, Enhanced: Claude
 * @version 3.0.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Sparkles,
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

// Custom hooks for authentication
import { useAuth } from "@/hooks/useAuth";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useSignOut } from "@/hooks/useSignOut";

// Types
interface Subject {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
}

type ModalType = "create" | null;

/**
 * Navbar Component
 *
 * Main navigation interface containing authentication controls,
 * theme toggle, and access to main application features.
 */
const Navbar: React.FC = () => {
  // State management
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>("");

  // Custom hooks
  const { isAuthenticated, isLoading: authLoading, refreshAuth } = useAuth();
  const { user, loading: userLoading, refetchUser } = useFetchUser();
  const { signOut } = useSignOut();

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Computed states
  const isLoading = authLoading || userLoading;

  /**
   * Opens a specific modal type
   * @param modalType - The type of modal to open
   */
  const openModal = useCallback((modalType: ModalType) => {
    setActiveModal(modalType);
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
   * Handles user sign out process
   */
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setMenuOpen(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      // Error could be handled with a toast notification
    }
  }, [router, signOut]);

  /**
   * Redirects to sign in page
   */
  const handleSignIn = useCallback(() => {
    router.push("/sign-in");

    // Set up an event listener to check auth status after navigation
    const checkAuthAfterRedirect = setTimeout(() => {
      refreshAuth();
      refetchUser();
    }, 1000);

    closeModal();
    setMenuOpen(false);

    return () => clearTimeout(checkAuthAfterRedirect);
  }, [router, closeModal, refreshAuth, refetchUser]);

  /**
   * Redirects to sign up page
   */
  const handleSignUp = useCallback(() => {
    router.push("/sign-up");

    // Set up an event listener to check auth status after navigation
    const checkAuthAfterRedirect = setTimeout(() => {
      refreshAuth();
      refetchUser();
    }, 1000);

    closeModal();
    setMenuOpen(false);

    return () => clearTimeout(checkAuthAfterRedirect);
  }, [router, closeModal, refreshAuth, refetchUser]);

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

  // Update auth state when path changes (for when user signs in/out)
  useEffect(() => {
    // Check if the path indicates an auth-related action
    if (
      pathname.includes("sign-in") ||
      pathname.includes("sign-up") ||
      pathname === "/"
    ) {
      refreshAuth();
      refetchUser();
    }

    setMenuOpen(false);
  }, [pathname, refreshAuth, refetchUser]);

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <header className='fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-sm'>
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
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className='ml-1 text-amber-500 dark:text-amber-400'
              >
                <Sparkles size={20} />
              </motion.span>
            </h1>
            {/* <span className='text-sm font-normal text-gray-600 dark:text-gray-400 transition-opacity duration-300 opacity-80 group-hover:opacity-100'>
              By Ashutosh Kumar
            </span> */}
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleMenu}
            className='md:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 rounded-md p-1.5'
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
            animate={
              isMenuOpen
                ? { height: "auto", opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            className={`md:h-auto w-full md:w-auto overflow-hidden md:overflow-visible ${
              isMenuOpen ? "block" : "hidden md:block"
            }`}
          >
            <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0 pb-4 md:pb-0 align-middle'>
              {/* Welcome message for authenticated users */}
              {/* {isAuthenticated && user && !isLoading && (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={fadeInVariants}
                  className='hidden md:flex items-center mr-2 md:mr-4 mb-3 md:mb-0'
                >
                  <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8 border border-gray-200 dark:border-gray-700 ring-2 ring-blue-500/20 dark:ring-blue-400/20'>
                      <AvatarImage
                        // @ts-ignore
                        src={user.profileImage || ""}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium'>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className='hidden md:block'>
                      <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
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
                <div className='flex gap-2 md:gap-4 animate-pulse'>
                  <Skeleton className='h-10 w-24' />
                  <Skeleton className='h-10 w-24' />
                </div>
              ) : isAuthenticated ? (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={fadeInVariants}
                  className='flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto'
                >
                  {/* Main Navigation Buttons for Authenticated Users */}
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href='/dashboard'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 w-full md:w-auto transition-colors duration-200'
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
                            className='flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 w-full md:w-auto transition-colors duration-200'
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
                          className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full md:w-auto transition-colors duration-200'
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

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSignOut}
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border-gray-200 dark:border-gray-700 w-full md:w-auto transition-colors duration-200'
                    >
                      <LogOutIcon size={16} />
                      <span>Sign Out</span>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={fadeInVariants}
                  className='flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto'
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSignIn}
                      variant='outline'
                      size='sm'
                      className='border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 w-full md:w-auto transition-colors duration-200'
                    >
                      Sign In
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSignUp}
                      size='sm'
                      className='bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto shadow-sm hover:shadow transition-all duration-200'
                    >
                      Get Started
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Theme Toggle and External Links */}
              <div className='flex items-center gap-3 mt-3 md:mt-0'>
                <Link
                  href='https://ashusnapx.vercel.app/'
                  className='flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setMenuOpen(false)}
                >
                  <Github size={20} className='text-black dark:text-white' />
                  {/* <span className='md:hidden lg:inline'>Github</span> */}
                </Link>

                {/* Themed toggle with animation */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className='transition-all duration-300'
                >
                  <ModeToggle />
                </motion.div>

                {/* New Feature Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge
                    variant='outline'
                    className='hidden md:flex text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-2 py-1'
                  >
                    <Sparkles size={12} className='mr-1' /> AI Powered
                  </Badge>
                </motion.div>
              </div>
            </div>
          </motion.nav>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={activeModal === "create"}
        onClose={closeModal}
        onSubjectCreated={() => {
          closeModal();
        }}
      />
    </header>
  );
};

export default Navbar;
