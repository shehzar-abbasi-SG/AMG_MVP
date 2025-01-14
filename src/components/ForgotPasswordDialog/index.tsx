"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";

const passwordResetSchema = z.object({
    // currentPassword: z
    //   .string()
    //   .min(8, "Password must be at least 8 characters")
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[0-9]/, "Password must contain at least one number"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"]
  });

type ForgotPasswordForm = z.infer<typeof passwordResetSchema>;

interface ForgetPasswordDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
  }

export function ForgotPasswordModal({open,onOpenChange}:ForgetPasswordDialogProps) {

    const {isLoading,updateUserPassword} = useUser()
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
    //   currentPassword: "",
      newPassword:"",
      confirmNewPassword:""
    },
  });
  const {formState:{isDirty}} = form
  async function onSubmit(data: ForgotPasswordForm) {
    console.log('data :>> ', data);
    await updateUserPassword(data.newPassword)
    onOpenChange(false);
    form.reset();
  
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Change Your Password</DialogTitle>
          </div>
        </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                        <Input {...field} className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                /> */}
                <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                    <Input 
                        type="password"
                        {...field} 
                        className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" />

                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            
                <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                    <FormItem >
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                        <Input 
                            type="password"
                            {...field} className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button disabled={!isDirty||isLoading} type="submit" className="w-full">
                Change Password
                </Button>
            </form>
            </Form>
      </DialogContent>
    </Dialog>
  );
}