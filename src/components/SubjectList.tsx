"use client";

import React, { useEffect, useState } from "react";
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
import Select from "react-select"; // Import react-select

const SubjectList = () => {
  const user = useFetchUser();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const router = useRouter();

  const getGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    if (hours < 20) return "Good evening";
    return "Good night";
  };

  useEffect(() => {
    const getSubjects = async () => {
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
            const totalChapters = chapterData.length;

            // Convert lastOpened to a Date object
            const lastOpened = new Date(subject.lastOpened || new Date(0));

            return {
              ...subject,
              completedChapters,
              totalChapters,
              lastOpened, // Ensure this is a Date object
            };
          })
        );

        // Sort subjects based on `lastOpened`
        subjectsWithProgress.sort(
          (a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()
        );

        setSubjects(subjectsWithProgress);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, []);

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubjectUpdated = (updatedSubject: any) => {
    setSubjects(
      (prevSubjects) =>
        prevSubjects
          .map((subject) =>
            subject.$id === updatedSubject.$id ? updatedSubject : subject
          )
          .sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()) // Sort updated subjects
    );
  };

  const handleDeleteClick = (subject: any) => {
    setDeletingSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
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
  };

  const handleSubjectCreated = (newSubject: any) => {
    setSubjects((prevSubjects) =>
      [newSubject, ...prevSubjects].sort(
        (a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()
      )
    );
  };

  const handleCreateSubjectClick = () => {
    if (isLoggedIn) {
      setIsCreateModalOpen(true);
    } else {
      router.push("/sign-in");
    }
  };

  const handleSubjectOpen = async (subject: any) => {
    // Update the lastOpened timestamp
    const now = new Date();
    await updateSubjectLastOpened(subject.$id, now);

    // Update state to reflect changes
    setSubjects(
      (prevSubjects) =>
        prevSubjects
          .map((s) => (s.$id === subject.$id ? { ...s, lastOpened: now } : s))
          .sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()) // Sort again
    );
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter((subject) =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSubjects = filteredSubjects.length;
  const totalChapters = filteredSubjects.reduce(
    (acc, subject) => acc + subject.totalChapters,
    0
  );
  const totalCompletedChapters = filteredSubjects.reduce(
    (acc, subject) => acc + subject.completedChapters,
    0
  );

  if (loading) {
    return (
      <div className='mt-20 p-4'>
        <h1 className='mt-5 mb-5 ml-4 text-2xl font-semibold tracking-tighter'>
          {getGreeting()} {user?.user?.name || "Guest"} 👋🏻
        </h1>
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className='p-4 border rounded shadow'>
                <Skeleton className='h-12 w-12 rounded-full mb-4' />
                <div className='space-y-4'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                  <Skeleton className='h-4 w-[150px]' />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className='mt-12 md:mt-20 p-4'>
      <div className='flex md:items-center justify-between flex-col md:flex-row'>
        <h1 className='mt-5 md:mb-5 ml-4 text-2xl font-semibold tracking-tighter'>
          {getGreeting()}{" "}
          <span className='text-blue-600 capitalize'>
            {user?.user?.name || "Guest"}
          </span>{" "}
          👋🏻
          <br />
          {!user.user ? (
            <>Create subjects &rarr;</>
          ) : (
            <>Here are your subjects &rarr;</>
          )}
        </h1>

        <p className='mt-0 md:mt-5 mb-5 ml-4 text-2xl font-semibold tracking-tighter '>
          <span className='font-semibold'>
            Total <span className='text-blue-600'>Subjects</span>:
          </span>{" "}
          {totalSubjects} <br />
          <span className='font-semibold'>
            Total <span className='text-blue-600'>Chapters</span>:
          </span>{" "}
          {totalChapters} <br />
          <span className='font-semibold'>
            Completed <span className='text-blue-600'>Chapters</span>:
          </span>{" "}
          {totalCompletedChapters}
        </p>
      </div>

      {/* Search Bar */}
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
          className='capitalize dark:text-black rounded-full'
        />
      </div>

      {filteredSubjects.length === 0 ? (
        <div className='flex flex-col items-center text-center'>
          <p>No subjects found. Click below to create a new subject.</p>
          <button
            onClick={handleCreateSubjectClick}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
          >
            Create Subject
          </button>
        </div>
      ) : (
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 capitalize'>
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.$id}
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
          ))}
        </div>
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
    </div>
  );
};

export default SubjectList;
