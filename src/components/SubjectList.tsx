"use client";

import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import { useSubject } from "@/hooks/useSubject"; // Import your custom hook for managing subjects
import { fetchSubjects } from "@/lib/appwrite";
import CreateModal from "./CreateModal";
import { Button } from "./ui/button";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteSubject: deleteSubjectHandler } = useSubject();

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, []);

  const handleEdit = (id: string) => {
    // Handle the edit action, e.g., open a modal with the current subject data
    console.log(`Edit subject with ID: ${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubjectHandler(id);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.$id}
            id={subject.$id}
            title={subject.title}
            description={subject.description}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubjectCreated={handleSubjectCreated}
      />
    </div>
  );
};

export default SubjectList;
