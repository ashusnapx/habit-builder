"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/hooks/useSignUp";
import { useFetchUser } from "@/hooks/useFetchUser";
import { signIn } from "@/lib/appwrite";
import { Eye, EyeOff } from "lucide-react"; // Import icons

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { signUp, error, success } = useSignUp();
  const router = useRouter();
  const { user } = useFetchUser();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, name } = formData;
    const response = await signUp(email, password, name);
    if (response.success) {
      await signIn(email, password);
      router.push("/");
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const inputs = [
    {
      id: "name",
      type: "text",
      placeholder: "Enter your name",
      label: "Name",
      value: formData.name,
    },
    {
      id: "email",
      type: "email",
      placeholder: "Enter your email",
      label: "Email",
      value: formData.email,
    },
    {
      id: "password",
      type: showPassword ? "text" : "password", // Toggle password type based on showPassword state
      placeholder: "Enter your password",
      label: "Password",
      value: formData.password,
    },
  ];

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Sign Up</CardTitle>
          <CardTitle className='tracking-tighter'>
            HabitAI<sup>©</sup>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className='space-y-4'>
              {inputs.map((input) => (
                <div key={input.id} className='relative'>
                  <Label htmlFor={input.id}>{input.label}</Label>
                  <Input
                    id={input.id}
                    type={input.type}
                    value={input.value}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    className='pr-10' // Add padding to the right for the icon
                  />
                  {input.id === "password" && (
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute top-9 right-3 text-gray-600'
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col items-center space-y-4'>
          <div className='flex flex-row items-center gap-9 w-full'>
            <Button onClick={handleSignUp} className='w-full'>
              Sign Up
            </Button>
            <Button onClick={handleSignIn} className='w-full'>
              Sign In
            </Button>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          {success && <p className='text-green-500'>{success}</p>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
