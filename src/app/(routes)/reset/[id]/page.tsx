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
import { LockKeyhole } from "lucide-react"
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import toast from "react-hot-toast"

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const id = params.id as string
    const token = searchParams.get('token')

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
        password: "",
        confirmPassword: "",
        },
    })

    useEffect(() => {
        if (!id || !token) {
            console.log('Invalid reset attempt: Missing id or token')
            router.replace('/')
        }
    }, [id, token])

  async function onSubmit(values: ResetPasswordValues) {
        const {password} = values
        console.log({
            id,
            token,
            password: values.password
        })
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetToken:token, password,id }),
            });
    
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }
            const { message } = await response.json();
            toast.success(message);
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            else {
                toast.error("Reset Password failed. Please try again.");
            }
        }
  }

  return (
    <div className="min-h-[calc(100vh_-_100px)] flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg ">
        <Image
            alt="AMG Logo"
            src="/amg.svg"
            className="mx-auto h-10 w-auto"
            width={200}
            height={300}
        />
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <LockKeyhole className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Please enter your new password below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"

                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"

                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button type="submit" className="w-full">
                Reset Password
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