'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/UserContext"
import { useEffect } from "react"

const accountFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface EditAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAccountDialog({ open, onOpenChange }: EditAccountDialogProps) {
    const {user,updateUser,isLoading} = useUser()
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues:user??{firstName:"",lastName:"",email:""},
    })
    const {formState:{isDirty}} = form
    useEffect(() => {
        if(!open) return
        if(!user) return
        form.reset(user)
    }, [open, user, form])

  async function onSubmit(data: AccountFormValues) {
      console.log(data)
      await updateUser(data)
      onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Edit Account Details</DialogTitle>
          </div>
        </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input {...field} className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input {...field} className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" />

                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>

                <div className="space-y-4">
                <h2 className="text-lg font-semibold">Change Account Email</h2>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem >
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input {...field} type="email" className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>

                <Button disabled={!isDirty||isLoading} type="submit" className="w-full">
                Save
                </Button>
            </form>
            </Form>
      </DialogContent>
    </Dialog>
  )
}