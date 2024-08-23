"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { updateSubject } from "@/lib/appwrite"; // Import your update subject function

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectUpdated: (updatedSubject: any) => void;
  subject: any; // Update the type according to your subject structure
}

const EditModal = ({
  isOpen,
  onClose,
  onSubjectUpdated,
  subject,
}: EditModalProps) => {
  const [newTitle, setNewTitle] = useState(subject.title);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewTitle(subject.title);
  }, [subject]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedSubject = await updateSubject(subject.$id, newTitle);
      onSubjectUpdated(updatedSubject);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating subject:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>Edit Subject</h2>
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder='Enter new title'
        />
        <div className='mt-4 flex gap-2'>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
