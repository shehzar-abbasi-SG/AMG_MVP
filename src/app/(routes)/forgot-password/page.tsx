'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import toast from "react-hot-toast"

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    const {email} = values
    try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
  
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
        }
  
        const { message } = await response.json();
  
        toast.success(message);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
      }else {
        toast.error("Login failed. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh_-_100px)] flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg">
         <Image
            alt="AMG Logo"
            src="/amg.svg"
            className="mx-auto h-10 w-auto"
            width={200}
            height={300}
          />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button type="submit" className="w-full">
                Send Reset Instructions
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.history.back()}
              >
                Back to Login
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}