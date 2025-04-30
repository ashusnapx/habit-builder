"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

// Components
import SubjectCard from "./SubjectCard";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";
import ShinyBadge from "./ShinyBadge";
import { WelcomeMessage } from "./WelcomeMessage";
import SubjectMetrics from "./SubjectMetrics";
import EmptyStatePrompt from "./EmptyStatePrompt";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Hooks and Utils
import { useFetchUser } from "@/hooks";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Data and Types
import {
  fetchSubjects,
  fetchChapters,
  deleteSubject,
  getCurrentUserId,
  updateSubjectLastOpened,
} from "@/lib/appwrite";
import {
  Subject,
  SubjectWithProgress,
  SortOption,
  Chapter,
} from "../../types/subject";

/**
 * SubjectList - Main dashboard component for displaying and managing user subjects
 *
 * Features:
 * - Displays subjects with progress information
 * - Provides analytics on learning progress
 * - Supports CRUD operations for subjects
 * - Implements smooth animations and transitions
 * - Persists user preferences for sorting and layout
 */
const SubjectList: React.FC = () => {
  // Core state
  const [subjects, setSubjects] = useState<SubjectWithProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] =
    useState<SubjectWithProgress | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingSubject, setDeletingSubject] =
    useState<SubjectWithProgress | null>(null);

  // User preferences
  const [sortOption, setSortOption] = useLocalStorage<SortOption>(
    "subjectSortOption",
    "lastOpened"
  );
  const [viewMode, setViewMode] = useLocalStorage<"grid" | "list">(
    "subjectViewMode",
    "grid"
  );

  // Hooks
  const user = useFetchUser();
  const router = useRouter();
  const { theme } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  /**
   * Fetches subjects and their associated chapter data
   * Calculates progress metrics for each subject
   */
  const fetchData = useCallback(async () => {
    try {
      // Check if user is logged in
      const userId = await getCurrentUserId();
      setIsLoggedIn(!!userId);

      if (!userId) {
        setLoading(false);
        return;
      }

      // Fetch all subjects
      const subjectData = await fetchSubjects();

      if (subjectData.length === 0) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      // For each subject, fetch chapters and calculate progress
      const subjectsWithProgress = await Promise.all(
        // @ts-ignore
        subjectData.map(async (subject: Subject) => {
          const chapterData = await fetchChapters(subject.$id);

          const completedChapters = chapterData.filter(
            (chapter) => chapter.completed
          ).length;

          // Calculate additional metrics
          const progressPercentage =
            chapterData.length > 0
              ? Math.round((completedChapters / chapterData.length) * 100)
              : 0;

          const lastStudiedDate = subject.lastOpened
            ? new Date(subject.lastOpened)
            : new Date(0);

          return {
            ...subject,
            completedChapters,
            totalChapters: chapterData.length,
            progressPercentage,
            lastOpened: lastStudiedDate,
            createdAt: new Date(subject.createdAt),
            chapters: chapterData,
          };
        })
      );

      // @ts-ignore
      setSubjects(subjectsWithProgress);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Handles opening the edit modal for a subject
   */
  const handleEdit = useCallback((subject: SubjectWithProgress) => {
    setEditingSubject(subject);
    setIsEditModalOpen(true);
  }, []);

  /**
   * Handles closing the edit modal
   */
  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
  }, []);

  /**
   * Updates a subject in the local state after editing
   */
  const handleSubjectUpdated = useCallback(
    (updatedSubject: SubjectWithProgress) => {
      setSubjects((prevSubjects) =>
        sortSubjects(
          prevSubjects.map((subject) =>
            subject.$id === updatedSubject.$id ? updatedSubject : subject
          ),
          sortOption
        )
      );
    },
    [sortOption]
  );

  /**
   * Initiates the subject deletion flow
   */
  const handleDeleteClick = useCallback((subject: SubjectWithProgress) => {
    setDeletingSubject(subject);
    setIsDeleteDialogOpen(true);
  }, []);

  /**
   * Confirms and processes subject deletion
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingSubject) return;

    try {
      await deleteSubject(deletingSubject.$id);
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.$id !== deletingSubject.$id)
      );
    } catch (error) {
      console.error("Failed to delete subject:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingSubject(null);
    }
  }, [deletingSubject]);

  /**
   * Adds a newly created subject to the local state
   */
  const handleSubjectCreated = useCallback(
    (newSubject: SubjectWithProgress) => {
      setSubjects((prevSubjects) =>
        sortSubjects(
          [
            {
              ...newSubject,
              completedChapters: 0,
              totalChapters: 0,
              progressPercentage: 0,
              lastOpened: new Date(),
              createdAt: new Date(newSubject.createdAt),
              chapters: [],
            },
            ...prevSubjects,
          ],
          sortOption
        )
      );
    },
    [sortOption]
  );

  /**
   * Handles the create subject button click
   * Redirects to sign-in if user is not logged in
   */
  const handleCreateSubjectClick = useCallback(() => {
    isLoggedIn ? setIsCreateModalOpen(true) : router.push("/sign-in");
  }, [isLoggedIn, router]);

  /**
   * Updates the last opened timestamp for a subject
   * Used for sorting and tracking user engagement
   */
  const handleSubjectOpen = useCallback(
    async (subject: SubjectWithProgress) => {
      const now = new Date();

      try {
        await updateSubjectLastOpened(subject.$id, now);

        setSubjects((prevSubjects) =>
          sortSubjects(
            prevSubjects.map((s) =>
              s.$id === subject.$id ? { ...s, lastOpened: now } : s
            ),
            sortOption
          )
        );

        // Navigate to subject detail page
        router.push(`/subjects/${subject.$id}/chapters`);
      } catch (error) {
        console.error("Failed to update last opened timestamp:", error);
      }
    },
    [router, sortOption]
  );

  /**
   * Sorts subjects based on the selected sort option
   */
  const sortSubjects = (
    subjectsToSort: SubjectWithProgress[],
    option: SortOption
  ): SubjectWithProgress[] => {
    switch (option) {
      case "lastOpened":
        return [...subjectsToSort].sort(
          (a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()
        );
      case "alphabetical":
        return [...subjectsToSort].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case "created":
        return [...subjectsToSort].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case "progress":
        return [...subjectsToSort].sort(
          (a, b) => b.progressPercentage - a.progressPercentage
        );
      default:
        return subjectsToSort;
    }
  };

  /**
   * Updates the sort option and re-sorts subjects
   */
  const handleSortChange = useCallback(
    (option: SortOption) => {
      setSortOption(option);
      setSubjects((prevSubjects) => sortSubjects([...prevSubjects], option));
    },
    [setSortOption]
  );

  /**
   * Toggles between grid and list view modes
   */
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, [setViewMode]);

  // Memoized computations for analytics
  const sortedSubjects = useMemo(
    () => sortSubjects([...subjects], sortOption),
    [subjects, sortOption]
  );

  const totalSubjects = useMemo(() => subjects.length, [subjects]);

  const totalChapters = useMemo(
    () => subjects.reduce((acc, subject) => acc + subject.totalChapters, 0),
    [subjects]
  );

  const totalCompletedChapters = useMemo(
    () => subjects.reduce((acc, subject) => acc + subject.completedChapters, 0),
    [subjects]
  );

  const overallProgressPercentage = useMemo(
    () =>
      totalChapters > 0
        ? Math.round((totalCompletedChapters / totalChapters) * 100)
        : 0,
    [totalCompletedChapters, totalChapters]
  );

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className='p-4 max-w-7xl mx-auto'>
        <div className='flex items-center mb-5'>
          <Skeleton className='h-8 w-64 dark:bg-gray-700' />
        </div>

        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className='p-6 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-800/50 backdrop-filter backdrop-blur-sm'
              >
                <Skeleton className='h-12 w-12 rounded-full mb-4 dark:bg-gray-700' />
                <div className='space-y-4'>
                  <Skeleton className='h-5 w-[250px] dark:bg-gray-700' />
                  <Skeleton className='h-4 w-[200px] dark:bg-gray-700' />
                  <Skeleton className='h-2 w-full dark:bg-gray-700' />
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-[100px] dark:bg-gray-700' />
                    <Skeleton className='h-4 w-[80px] dark:bg-gray-700' />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className='p-4 max-w-7xl mx-auto'
    >
      {/* Header Section */}
      <div className='flex flex-col space-y-6 mb-8'>
        {/* Welcome and User Info */}
        <div className='flex flex-col md:flex-row md:items-center justify-between capitalize'>
          <WelcomeMessage
            username={user?.user?.name || "Guest"}
            isPremium={false}
          />

          <div className='mt-4 md:mt-0'>
            <ShinyBadge label={user?.user ? "Free Tier" : "Guest"} />
          </div>
        </div>

        {/* Analytics Dashboard */}
        {subjects.length > 0 && (
          <SubjectMetrics
            totalSubjects={totalSubjects}
            totalChapters={totalChapters}
            completedChapters={totalCompletedChapters}
            overallProgress={overallProgressPercentage}
          />
        )}
      </div>

      {/* Search and Controls */}
      {subjects.length > 0 && (
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
          {/* Search Dropdown */}
          <div className='flex-grow max-w-md'>
            <Select
              options={subjects.map((subject) => ({
                value: subject.$id,
                label: subject.title,
              }))}
              onChange={(option) => {
                const selectedSubject = subjects.find(
                  (subject) => subject.$id === option?.value
                );
                if (selectedSubject) {
                  handleSubjectOpen(selectedSubject);
                }
              }}
              placeholder='🔍 Search subjects...'
              className='capitalize rounded-full'
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "9999px",
                  padding: "2px 8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                  backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                  "&:hover": {
                    borderColor: theme === "dark" ? "#4B5563" : "#D1D5DB",
                  },
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused
                    ? theme === "dark"
                      ? "#4B5563"
                      : "#F3F4F6"
                    : theme === "dark"
                    ? "#1F2937"
                    : "#FFFFFF",
                  color: theme === "dark" ? "#F9FAFB" : "#111827",
                }),
              }}
              id='subject-search'
            />
          </div>

          {/* Control Buttons */}
          <div className='flex space-x-3'>
            {/* Sort Options */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='relative inline-block'>
                    <select
                      value={sortOption}
                      onChange={(e) =>
                        handleSortChange(e.target.value as SortOption)
                      }
                      className='appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    >
                      <option value='lastOpened'>Recently Opened</option>
                      <option value='alphabetical'>Alphabetical</option>
                      <option value='created'>Recently Created</option>
                      <option value='progress'>Progress</option>
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
                      <svg
                        className='fill-current h-4 w-4'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                      </svg>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort subjects</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* View Mode Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleViewMode}
                    className='p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    {viewMode === "grid" ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <line x1='8' y1='6' x2='21' y2='6' />
                        <line x1='8' y1='12' x2='21' y2='12' />
                        <line x1='8' y1='18' x2='21' y2='18' />
                        <line x1='3' y1='6' x2='3.01' y2='6' />
                        <line x1='3' y1='12' x2='3.01' y2='12' />
                        <line x1='3' y1='18' x2='3.01' y2='18' />
                      </svg>
                    ) : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <rect x='3' y='3' width='7' height='7' />
                        <rect x='14' y='3' width='7' height='7' />
                        <rect x='14' y='14' width='7' height='7' />
                        <rect x='3' y='14' width='7' height='7' />
                      </svg>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle view mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Create Button */}
            <button
              onClick={handleCreateSubjectClick}
              className='flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2'
              >
                <line x1='12' y1='5' x2='12' y2='19'></line>
                <line x1='5' y1='12' x2='19' y2='12'></line>
              </svg>
              New Subject
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {subjects.length === 0 ? (
        <EmptyStatePrompt
          onCreateClick={handleCreateSubjectClick}
          isLoggedIn={isLoggedIn}
        />
      ) : (
        /* Subject Cards */
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className={
            viewMode === "grid"
              ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col space-y-4"
          }
        >
          <AnimatePresence>
            {sortedSubjects.map((subject) => (
              <motion.div
                key={subject.$id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <SubjectCard
                  id={subject.$id}
                  title={subject.title}
                  description={subject.description}
                  completedChapters={subject.completedChapters}
                  totalChapters={subject.totalChapters}
                  progressPercentage={subject.progressPercentage}
                  onEdit={() => handleEdit(subject)}
                  onDelete={() => handleDeleteClick(subject)}
                  onOpen={() => handleSubjectOpen(subject)}
                  createdAt={subject.createdAt}
                  lastOpened={subject.lastOpened}
                  viewMode={viewMode}
                  chapters={subject.chapters}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        // @ts-ignore
        onSubjectCreated={handleSubjectCreated}
      />

      {editingSubject && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          subject={editingSubject}
          onSubjectUpdated={handleSubjectUpdated}
        />
      )}

      {deletingSubject && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          subjectTitle={deletingSubject.title}
        />
      )}
    </motion.div>
  );
};

export default SubjectList;
