"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth from redirecting automatically
      email,
      password,
    });

    if (result?.error) {
      toast.error("Invalid email or password. Please try again.");
    } else if (result?.ok) {
      toast.success("Successfully signed in!");
      router.push("/documents");
    }
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-65px)] items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign In
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to log in to your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-foreground transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}