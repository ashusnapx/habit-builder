"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSubject } from "@/hooks/useSubject";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectCreated: (newSubjects: any[]) => void; // Callback to notify about the new subjects
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onSubjectCreated,
}) => {
  const [formData, setFormData] = useState({
    titles: "",
  });
  const { createSubject } = useSubject(); // Use the hook to create a subject

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subjects = formData.titles
        .split(",")
        .map((title) => title.trim())
        .filter((title) => title.length > 0);
      const newSubjects = [];
      for (const title of subjects) {
        const newSubject = await createSubject(title);
        newSubjects.push(newSubject);
      }
      onSubjectCreated(newSubjects);
      onClose(); // Close the modal first
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Failed to create subjects:", error);
    }
  };

  const formFields = [
    {
      id: "titles",
      label: "Subject Titles",
      placeholder: "Enter subject titles separated by commas",
    },
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        {/* Optional trigger button or element */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Subjects</DialogTitle>
          <DialogDescription>
            Enter the names of subjects you want to create, separated by commas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            {formFields.map((field) => (
              <div key={field.id} className='flex flex-col space-y-3'>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className='border rounded-lg'
                />
              </div>
            ))}
          </div>
          <div className='flex justify-between mt-4'>
            <Button variant='outline' type='button' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
