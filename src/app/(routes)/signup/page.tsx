'use client'
import toast from "react-hot-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.string().min(2, "Country is required"),
  company: z.string().min(1, "Company name is required"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province/State is required"),
  zip: z.string().min(5, "ZIP/Postal code is required"),
  referralSource: z.string().min(1, "Please tell us how you heard about us"),
})
export default function Signup() {

  const router = useRouter();
  const [isLoading,setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "shehzerabbasi552@gmail.com",
      password: "Password123!",
      firstName: "Shehzar",
      lastName: "Abbasi",
      phone: "+15142411011",
      country: "",
      company: "Stay Gold",
      address1: "2170 Avenue Lincoln",
      address2: "Apt 503",
      city: "Montreal",
      province: "Quebec",
      zip: "H2N 2N7",
      referralSource: "",
    },
  })
  const {logout,login} =useAuth()
  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    // Handle form submission here
    console.log(values)
    const {email, password, firstName, lastName, phone, address1,address2,company,country,city,zip,province } = values
    setIsLoading(true)
    try{
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password, firstName, lastName, phone }),
      });

      if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error);
      }
      
      const {customer} = await response.json()
      const metafields = [
        { namespace: "custom", key: "referral_source", value: JSON.stringify([values.referralSource]), type: "list.single_line_text_field",ownerId:customer.id },
      ];
      const metafieldsResponse = await fetch(`/api/customer/metafield`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metafields),
      });
      if (!metafieldsResponse.ok) {
        const { error } = await metafieldsResponse.json();
        throw new Error(error);
      }
      const customerAccesTokens = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email : values.email, password : values.password}),
      });

      if (!customerAccesTokens.ok) {
        const { error } = await customerAccesTokens.json();
        throw new Error(error);
      }
      const { token } = await customerAccesTokens.json();
      const {accessToken} = token
      login(token)
      const addressResponse = await fetch(`/api/customer/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({customerAccessToken: accessToken,address:{address1,address2,company,country,city,zip,province}}),
      });
      
      if (!addressResponse.ok) {
        const { error } = await addressResponse.json();
        throw new Error(error);
      }
        await logout()
        toast.success("Signup successful! Redirecting to login...");
        router.push("/login");
      }
      catch(error){
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("Signup failed. Please try again.");
        }

      }finally{
        setIsLoading(false)
      }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="AMG Logo"
            src="/amg.svg"
            className="mx-auto h-10 w-auto"
            width={200}
            height={300}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create your account
          </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                    
                    />

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
                    <Input placeholder="Doe" {...field}
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                    
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 000-0000" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Company Name" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Apt 4B" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                  
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                    
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="NY" {...field}
                    
                    className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP/Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="10001" {...field} 
                      className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none"
                    
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="referralSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a referral source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Web Search">Web Search</SelectItem>
                    <SelectItem value="Tiktok">Tiktok</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">Register</Button>
        </form>
      </Form>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-black hover:text-black">
            Signin
          </Link>
        </p>
      </div>
    </div>
  )
}
