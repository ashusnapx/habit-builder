/**
 * CreateSubjectModal.tsx
 *
 * A comprehensive modal component for creating new subject entries.
 * Features form validation, real-time feedback, and optimized UX flow.
 *
 * @author Ashutosh Kumar
 * @version 1.0.0
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSubject } from "@/hooks/useSubject";
import { toast } from "@/hooks/use-toast";

/**
 * Type definition for subject objects
 */
interface Subject {
  id: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Props for the CreateSubjectModal component
 */
interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectCreated: (newSubjects: Subject[]) => void;
}

/**
 * Modal component for creating new subjects with an enhanced user experience
 * and proper form validation.
 */
const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubjectCreated,
}) => {
  // State management
  const [titles, setTitles] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [parsedTitles, setParsedTitles] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Custom hooks
  const { createSubject } = useSubject();

  /**
   * Parse and validate the comma-separated titles
   */
  const validateAndParseTitles = useCallback(() => {
    const errors: string[] = [];
    const titleList = titles
      .split(",")
      .map((title) => title.trim())
      .filter((title) => title.length > 0);

    // Validate for duplicate titles
    const uniqueTitles = new Set<string>();
    const duplicates = new Set<string>();

    titleList.forEach((title) => {
      if (uniqueTitles.has(title.toLowerCase())) {
        duplicates.add(title);
      } else {
        uniqueTitles.add(title.toLowerCase());
      }
    });

    // Validate for title length
    const invalidLengthTitles = titleList.filter(
      (title) => title.length < 2 || title.length > 50
    );

    if (duplicates.size > 0) {
      errors.push(
        `Duplicate titles found: ${Array.from(duplicates).join(", ")}`
      );
    }

    if (invalidLengthTitles.length > 0) {
      errors.push("Subject titles must be between 2 and 50 characters");
    }

    setValidationErrors(errors);
    setParsedTitles(
      Array.from(uniqueTitles).map(
        (title) => title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
      )
    );

    return errors.length === 0;
  }, [titles]);

  /**
   * Effect to validate titles whenever they change
   */
  useEffect(() => {
    if (titles.length > 0) {
      validateAndParseTitles();
    } else {
      setParsedTitles([]);
      setValidationErrors([]);
    }
  }, [titles, validateAndParseTitles]);

  /**
   * Handle input change for the titles field
   */
  const handleTitlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitles(e.target.value);
  };

  /**
   * Reset the form to its initial state
   */
  const resetForm = () => {
    setTitles("");
    setParsedTitles([]);
    setValidationErrors([]);
    setIsSubmitting(false);
  };

  /**
   * Handle form submission to create new subjects
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndParseTitles() || parsedTitles.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newSubjects: Subject[] = [];

      for (const title of parsedTitles) {
        const newSubject = await createSubject(title);
        // @ts-ignore
        newSubjects.push(newSubject);
      }

      onSubjectCreated(newSubjects);

      toast({
        title: "Success!",
        description: `Created ${newSubjects.length} new subject${
          newSubjects.length > 1 ? "s" : ""
        }.`,
      });

      resetForm();
      onClose();

      location.reload();
    } catch (error) {
      console.error("Failed to create subjects:", error);

      toast({
        title: "Error creating subjects",
        description:
          "There was a problem creating your subjects. Please try again.",
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  /**
   * Handle closing the modal with cleanup
   */
  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl flex items-center'>
            <Plus className='mr-2 h-5 w-5 text-blue-600' />
            Create New Subjects
          </DialogTitle>
          <DialogDescription>
            Enter subject titles separated by commas. Each subject will be
            created as a separate entity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='mt-4'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='titles' className='text-sm font-medium'>
                Subject Titles
              </Label>
              <Input
                id='titles'
                value={titles}
                onChange={handleTitlesChange}
                placeholder='Math, Science, History, Art...'
                className='w-full'
                disabled={isSubmitting}
                aria-invalid={validationErrors.length > 0}
                aria-describedby='titles-error'
              />

              {validationErrors.length > 0 && (
                <div id='titles-error' className='text-sm text-red-500 mt-1'>
                  {validationErrors.map((error, index) => (
                    <div key={index} className='flex items-start gap-1'>
                      <AlertCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {parsedTitles.length > 0 && (
              <div className='bg-gray-50 dark:bg-gray-800 rounded-md p-3'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Subjects to create ({parsedTitles.length}):
                </Label>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {parsedTitles.map((title, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    >
                      <Check className='mr-1 h-3 w-3' />
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className='mt-6 gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                isSubmitting ||
                parsedTitles.length === 0 ||
                validationErrors.length > 0
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                "Create Subjects"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubjectModal;
