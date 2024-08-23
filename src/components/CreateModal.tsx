"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useSubject } from "@/hooks/useSubject";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectCreated: (newSubject: any) => void; // Callback to notify about the new subject
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onSubjectCreated,
}) => {
  const [formData, setFormData] = useState({
    title: "",
  });
  const { createSubject } = useSubject(); // Use the hook to create a subject

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSubject = await createSubject(formData.title);
      onSubjectCreated(newSubject);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  };

  const formFields = [
    { id: "title", label: "Subject Title", placeholder: "Enter Subject Title" },
  ];

  const handleOutsideClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).id === "modal-overlay") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id='modal-overlay'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={handleOutsideClick}
    >
      <Card className='w-full max-w-md p-4 relative'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Create New Subject</CardTitle>
            <CardDescription className='mt-2'>
              Fill out the form below to create a new subject.
            </CardDescription>
          </div>
          <Button
            variant='destructive'
            className=' rounded-full'
            onClick={onClose}
          >
            <X className='w-8 h-8' />
          </Button>
        </CardHeader>
        <CardContent>
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
          </form>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' onClick={handleSubmit}>
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateModal;
