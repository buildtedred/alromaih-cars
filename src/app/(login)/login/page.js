"use client";

import { useState } from "react";
import { login } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.target);
    await login(formData);

    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <Card className="w-full max-w-md border border-gray-200 shadow-md rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Welcome Back</CardTitle>
          <p className="text-sm text-gray-500">Log in to continue</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input id="password" name="password" type="password" placeholder="Password" required className="pl-10" />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
