"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createTarget } from "@/lib/appwrite";
import { TargetIcon } from "lucide-react";

const TargetModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [chapters, setChapters] = React.useState<number | "">("");
  const [chaptersPerDay, setChaptersPerDay] = React.useState<number | null>(
    null
  );

  const handleSetTarget = async () => {
    if (date && chapters) {
      const days = Math.ceil(
        (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      const chaptersPerDayValue = chapters / days;
      setChaptersPerDay(chaptersPerDayValue);

      // Save the target to the database
      try {
        await createTarget({
          chaptersPerDay: chaptersPerDayValue,
          totalChapters: chapters,
          targetDate: date.toISOString(),
          createdAt: new Date().toISOString(),
          user: "66cb1f0a0038f963b2ef", // Replace with actual user ID if dynamic
        });
        alert("Target set successfully!");
      } catch (error) {
        console.error("Failed to create target:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='flex items-center space-x-2 md:space-x-1' variant="outline">
          <TargetIcon size={18} /> <span>Set Target</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Target</DialogTitle>
          <DialogDescription>
            Select your target date and the number of chapters you want to
            complete.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            className='rounded-md border'
          />
          <div>
            <label
              htmlFor='chapters'
              className='block text-sm font-medium text-gray-700'
            >
              Number of Chapters:
            </label>
            <Input
              id='chapters'
              type='number'
              value={chapters}
              onChange={(e) => setChapters(Number(e.target.value))}
              className='mt-1 block w-full'
            />
          </div>
          <Button onClick={handleSetTarget}>Calculate and Save</Button>
          {chaptersPerDay !== null && (
            <p className='mt-4'>
              To achieve your goal, you need to complete{" "}
              <span className='font-semibold'>{chaptersPerDay.toFixed(2)}</span>{" "}
              chapters per day.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TargetModal;
