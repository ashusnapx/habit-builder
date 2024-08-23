"use client";

import { useState } from "react";
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
import { useSignIn } from "@/hooks/useSignIn";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const { signIn, error, success } = useSignIn();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signIn(formData.email, formData.password);

    console.log("Sign in response:", response);
    if (response.success) {
      router.push("/");
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  const inputFields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Sign In</CardTitle>
          <CardTitle className='tracking-tighter'>
            HabitAI<sup>©</sup>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className='space-y-4'>
              {inputFields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col items-center space-y-4'>
          <div className='flex flex-row items-center gap-9'>
            <Button onClick={handleSignIn} className='w-full'>
              Sign In
            </Button>
            <Button onClick={handleSignUp} className='w-full'>
              Sign Up
            </Button>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          {success && <p className='text-green-500'>{success}</p>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
