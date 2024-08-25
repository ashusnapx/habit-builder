"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  subjectTitle: string;
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onDeleteConfirm,
  subjectTitle,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{subjectTitle}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4 flex gap-2'>
          <Button onClick={onDeleteConfirm} variant='destructive'>
            Delete
          </Button>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
