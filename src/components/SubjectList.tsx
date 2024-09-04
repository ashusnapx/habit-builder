"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import SubjectCard from "./SubjectCard";
import {
  fetchSubjects,
  fetchChapters,
  deleteSubject,
  getCurrentUserId,
  updateSubjectLastOpened,
} from "@/lib/appwrite";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUser } from "@/hooks";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import Select from "react-select";
import { motion } from "framer-motion";

const SubjectList: React.FC = () => {
  const user = useFetchUser();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<any>(null);

  const router = useRouter();

  const getGreeting = useCallback(() => {
    const hours = new Date().getHours();
    return hours < 12
      ? "Good morning"
      : hours < 17
      ? "Good afternoon"
      : hours < 20
      ? "Good evening"
      : "Good night";
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const userId = await getCurrentUserId();
      setIsLoggedIn(!!userId);

      if (!userId) {
        setLoading(false);
        return;
      }

      const subjectData = await fetchSubjects();
      if (subjectData.length === 0) {
        setSubjects([]);
        return;
      }

      const subjectsWithProgress = await Promise.all(
        subjectData.reverse().map(async (subject) => {
          const chapterData = await fetchChapters(subject.$id);
          const completedChapters = chapterData.filter(
            (chapter) => chapter.completed
          ).length;
          return {
            ...subject,
            completedChapters,
            totalChapters: chapterData.length,
            lastOpened: new Date(subject.lastOpened || new Date(0)),
          };
        })
      );

      setSubjects(
        subjectsWithProgress.sort(
          (a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()
        )
      );
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = useCallback((subject: any) => {
    setEditingSubject(subject);
    setIsEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
  }, []);

  const handleSubjectUpdated = useCallback((updatedSubject: any) => {
    setSubjects((prevSubjects) =>
      prevSubjects
        .map((subject) =>
          subject.$id === updatedSubject.$id ? updatedSubject : subject
        )
        .sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime())
    );
  }, []);

  const handleDeleteClick = useCallback((subject: any) => {
    setDeletingSubject(subject);
    setIsDeleteDialogOpen(true);
  }, []);

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

  const handleSubjectCreated = useCallback((newSubject: any) => {
    setSubjects((prevSubjects) =>
      [newSubject, ...prevSubjects].sort(
        (a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()
      )
    );
  }, []);

  const handleCreateSubjectClick = useCallback(() => {
    isLoggedIn ? setIsCreateModalOpen(true) : router.push("/sign-in");
  }, [isLoggedIn, router]);

  const handleSubjectOpen = useCallback(async (subject: any) => {
    const now = new Date();
    await updateSubjectLastOpened(subject.$id, now);
    setSubjects((prevSubjects) =>
      prevSubjects
        .map((s) => (s.$id === subject.$id ? { ...s, lastOpened: now } : s))
        .sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime())
    );
  }, []);

  const totalSubjects = useMemo(() => subjects.length, [subjects]);
  const totalChapters = useMemo(
    () => subjects.reduce((acc, subject) => acc + subject.totalChapters, 0),
    [subjects]
  );
  const totalCompletedChapters = useMemo(
    () => subjects.reduce((acc, subject) => acc + subject.completedChapters, 0),
    [subjects]
  );

  if (loading) {
    return (
      <div className='mt-12 p-4'>
        <h1 className='mt-5 mb-5 text-2xl font-semibold tracking-tighter capitalize text-gray-800 dark:text-gray-200'>
          {getGreeting()} {user?.user?.name || "Guest"} 👋🏻
        </h1>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className='p-4 border rounded shadow dark:border-gray-700 dark:bg-gray-800'
              >
                <Skeleton className='h-12 w-12 rounded-full mb-4 dark:bg-gray-700' />
                <div className='space-y-4'>
                  <Skeleton className='h-4 w-[250px] dark:bg-gray-700' />
                  <Skeleton className='h-4 w-[200px] dark:bg-gray-700' />
                  <Skeleton className='h-4 w-[150px] dark:bg-gray-700' />
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
      transition={{ duration: 0.5 }}
      className='mt-12 md:mt-20 p-4'
    >
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-6'>
        <div className='flex flex-col space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
            {getGreeting()},{" "}
            <span className='text-blue-600 dark:text-blue-400 capitalize'>
              {user?.user?.name || "Guest"}
            </span>{" "}
            👋🏻
          </h1>
          <p className='text-lg text-gray-700 dark:text-gray-300'>
            {!user.user
              ? "Create subjects to start your journey!"
              : "Here are your subjects:"}
          </p>
        </div>

        <div className='flex flex-col mt-4 md:mt-0 space-y-1 md:text-right'>
          <p className='text-lg font-medium text-gray-800 dark:text-gray-200'>
            Total{" "}
            <span className='text-blue-600 dark:text-blue-400'>Subjects</span>:{" "}
            {totalSubjects}
          </p>
          <p className='text-lg font-medium text-gray-800 dark:text-gray-200'>
            Total{" "}
            <span className='text-blue-600 dark:text-blue-400'>Chapters</span>:{" "}
            {totalChapters}
          </p>
          <p className='text-lg font-medium text-gray-800 dark:text-gray-200'>
            Completed{" "}
            <span className='text-blue-600 dark:text-blue-400'>Chapters</span>:{" "}
            {totalCompletedChapters}
          </p>
        </div>
      </div>

      <div className='mb-6'>
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
          placeholder='Search subjects...'
          className='capitalize dark:text-black'
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "50px",
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
              boxShadow: "none",
              "&:hover": { borderColor: "var(--hover-border-color)" },
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused
                ? "var(--focus-bg-color)"
                : "var(--bg-color)",
              color: "var(--text-color)",
            }),
          }}
        />
      </div>

      {subjects.length === 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col items-center text-center space-y-4 py-6'
        >
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            No subjects found. Create a new subject to get started!
          </p>
          <button
            onClick={handleCreateSubjectClick}
            className='px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition'
          >
            Create Subject
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        >
          {subjects.map((subject) => (
            <motion.div key={subject.$id} layout>
              <SubjectCard
                id={subject.$id}
                title={subject.title}
                description={subject.description}
                completedChapters={subject.completedChapters}
                totalChapters={subject.totalChapters}
                onEdit={() => handleEdit(subject)}
                onDelete={() => handleDeleteClick(subject)}
                onOpen={() => handleSubjectOpen(subject)}
                lastOpened={subject.lastOpened}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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
