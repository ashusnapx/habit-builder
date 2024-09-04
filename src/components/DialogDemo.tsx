// QuoteDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  content: string;
}

export function QuoteDialog({ open, onClose, content }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Quote Content</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <p>{content}</p>
        </div>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
