"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-modal bg-white">
        <CardHeader className="space-y-1 text-center pb-8">
          <h1 className="text-4xl font-display text-foreground tracking-tight">Tso Finance</h1>
          <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
            Your money. Your clarity. Your command.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] font-semibold text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="daniel@example.com"
                required
                className="h-10 border-border focus-visible:ring-steel-blue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" throws-error="text-[13px] font-semibold text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="h-10 border-border focus-visible:ring-steel-blue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-negative text-[12px] font-bold bg-negative-bg px-3 py-2 rounded-sm border border-negative/10">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-10 bg-steel-blue hover:bg-steel-blue/90 text-white font-semibold transition-all shadow-card"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In to Command Center"}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-divider text-center">
            <p className="text-[11px] text-muted-foreground">
              Tso Finance v1.0.0 — Prototype Version
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
