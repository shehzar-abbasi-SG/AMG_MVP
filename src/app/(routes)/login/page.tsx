'use client'
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation"
import { useState } from "react";
import toast from "react-hot-toast";

export default function Signin() {
  const [email, setEmail] = useState("shehzerabbasi552@gmail.com");
  const [password, setPassword] = useState("Password123!");
  const [isLoading,setIsLoading] = useState(false)
  const router = useRouter();
  const {login} = useAuth()
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try { 
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      const { token } = await response.json();
      console.log('token ===> ', token);
      login(token)

      toast.success("Login successful! Redirecting to Home...");
      router.push("/"); 
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
    }else {
      toast.error("Login failed. Please try again.");
    }

    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="flex min-h-[calc(100vh_-_100px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="AMG Logo"
            src="/amg.svg"
            className="mx-auto h-10 w-auto"
            width={200}
            height={300}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
              <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-black sm:text-sm/6"

                />
               
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="forgot-password" className="font-semibold text-black hover:text-black">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-black sm:text-sm/6"
                />
              </div>
            </div>

            <div>
            <Button 
            type="submit"
            className="w-full bg-black"
            disabled={isLoading} 
            >
              Sign in
            </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not have an account?{' '}
            <Link href="/signup" className="font-semibold text-black hover:text-black">
              Signup
            </Link>
          </p>
        </div>
      </div>
  );
}
