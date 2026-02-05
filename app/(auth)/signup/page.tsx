"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signUpAction } from "@/app/actions/auth-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const result = await signUpAction({ email, password });

    if (result.error) {
      toast.error(result.error);
    }

    if (result.success) {
      toast.success(result.success);
      router.push("/signin");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex w-full min-h-[calc(100vh-65px)] items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign Up
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create an account.
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
              disabled={isLoading}
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
              disabled={isLoading}
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="underline hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}