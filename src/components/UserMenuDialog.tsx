"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github, LogOutIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/appwrite";

const UserMenuDialog = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleViewProfile = () => {
    // Logic for viewing profile can be added here
    router.push("/profile"); // Adjust the route to the correct profile page
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <User size={18} /> User Menu
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>User Menu</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          <Button
            asChild
            variant='outline'
            className='flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          >
            <a href='https://ashusnapx.vercel.app/' target='_blank'>
              <Github size={18} />
              <span>GitHub</span>
            </a>
          </Button>
          <Button
            onClick={handleViewProfile}
            variant='outline'
            className='flex items-center space-x-2'
          >
            <User size={18} />
            <span>View Profile</span>
          </Button>
          <Button
            onClick={handleSignOut}
            variant='outline'
            className='flex items-center space-x-2 hover:bg-red-500 hover:text-white'
          >
            <LogOutIcon size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
        <DialogFooter>
          <Button variant='ghost'>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserMenuDialog;
