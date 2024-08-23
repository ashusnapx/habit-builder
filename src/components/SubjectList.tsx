"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import SubjectCard from "./SubjectCard";
import {
  fetchSubjects,
  fetchChapters,
  deleteSubject,
  getCurrentUserId,
} from "@/lib/appwrite"; // Import getCurrentUserId function
import CreateModal from "./CreateModal";
import EditModal from "./EditModal";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null); // State to store the subject being edited
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // State for user authentication status

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const getSubjects = async () => {
      try {
        // Check if the user is logged in
        const userId = await getCurrentUserId();
        setIsLoggedIn(!!userId); // Set authentication status

        if (!userId) {
          // User is not logged in, no need to fetch subjects
          setLoading(false);
          return;
        }

        const subjectData = await fetchSubjects();
        if (subjectData.length === 0) {
          // No subjects found
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

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id); // Call delete function
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.$id !== id)
      );
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  const handleSubjectCreated = (newSubject: any) => {
    setSubjects((prevSubjects) => [newSubject, ...prevSubjects]);
  };

  const handleCreateSubjectClick = () => {
    if (isLoggedIn) {
      setIsCreateModalOpen(true);
    } else {
      router.push("/sign-in"); // Redirect to sign-in page
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='mt-20 p-4'>
      <h1 className='mt-5 mb-5 ml-4 text-2xl font-semibold tracking-tighter'>
        Subjects
      </h1>

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
              onDelete={handleDelete}
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
    </div>
  );
};

export default SubjectList;
