"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SubjectCard from "./SubjectCard";
import {
  fetchSubjects,
  fetchChapters,
  deleteSubject,
  getCurrentUserId,
} from "@/lib/appwrite";
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUser } from "@/hooks";
import TargetModal from "./TargetModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"; // Import the new component

const SubjectList = () => {
  const user = useFetchUser();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog
  const [deletingSubject, setDeletingSubject] = useState<any>(null); // State to store subject being deleted

  const router = useRouter();

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
          subjectData.map(async (subject) => {
            const chapterData = await fetchChapters(subject.$id);
            const completedChapters = chapterData.filter(
              (chapter) => chapter.completed
            ).length;
            const totalChapters = chapterData.length;
            return {
              ...subject,
              completedChapters,
              totalChapters,
            };
          })
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
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.$id === updatedSubject.$id ? updatedSubject : subject
      )
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
    setSubjects((prevSubjects) => [newSubject, ...prevSubjects]);
  };

  const handleCreateSubjectClick = () => {
    if (isLoggedIn) {
      setIsCreateModalOpen(true);
    } else {
      router.push("/sign-in");
    }
  };

  const totalSubjects = subjects.length;
  const totalChapters = subjects.reduce(
    (acc, subject) => acc + subject.totalChapters,
    0
  );

  if (loading) {
    return (
      <div className='mt-20 p-4'>
        <div className='text-base text-center font-semibold text-gray-900 dark:text-white mt-4 md:mt-0'>
          Welcome {user?.user?.name || "Guest"}
        </div>
        <h1 className='mt-5 mb-5 ml-4 text-2xl font-semibold tracking-tighter'>
          Hi {user?.user?.name || "Guest"} 👋🏻
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
          Hi{" "}
          <span className='text-blue-600'>{user?.user?.name || "Guest"}</span>{" "}
          👋🏻
          <br />
          {!user ? (
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
          {totalChapters}
        </p>
      </div>

      {subjects.length === 0 ? (
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
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.$id}
              id={subject.$id}
              title={subject.title}
              description={subject.description}
              completedChapters={subject.completedChapters}
              totalChapters={subject.totalChapters}
              onEdit={() => handleEdit(subject)}
              onDelete={() => handleDeleteClick(subject)}
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
          onSubjectUpdated={handleSubjectUpdated}
          subject={editingSubject}
        />
      )}

      {deletingSubject && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDeleteConfirm={handleDeleteConfirm}
          subjectTitle={deletingSubject.title}
        />
      )}
    </div>
  );
};

export default SubjectList;
