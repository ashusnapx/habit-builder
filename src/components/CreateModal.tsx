import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
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
      <Card className='w-[350px] relative'>
        <CardHeader className='flex justify-between'>
          <div>
            <CardTitle>Create New Subject</CardTitle>
            <CardDescription>
              Add the subject details and create it.
            </CardDescription>
          </div>
          <Button
            variant='ghost'
            className='absolute top-3 right-2'
            onClick={onClose}
          >
            <X className='w-8 h-8 text-red-600' />
          </Button>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='subjectName'>Subject Name</Label>
                <Input id='subjectName' placeholder='Enter Subject Name' />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button>Create</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateModal;
