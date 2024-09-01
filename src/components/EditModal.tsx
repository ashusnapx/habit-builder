"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { updateSubject } from "@/lib/appwrite"; // Import your update subject function

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectUpdated: (updatedSubject: any) => void;
  subject: any;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='m-4'>
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>

        <DialogDescription className='capitalize'>
          hola amigo! kaise ho theek ho?{" "}
        </DialogDescription>
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder='Enter new title'
          className="capitalize"
        />
        <div className='mt-4 flex gap-2'>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
