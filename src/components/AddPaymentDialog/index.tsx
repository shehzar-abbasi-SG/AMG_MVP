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
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import {formatPhoneNumber } from "@/utils";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  company: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "Region is required"),
  postalCode: z.string().min(1, "Postal/Zip code is required"),
});

type PaymentMethodForm = z.infer<typeof formSchema>;


interface PaymentMethodDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
  }

export function PaymentMethodModal({open,onOpenChange}:PaymentMethodDialogProps) {
  const {isLoading,addPaymentMethod,user} = useUser()
  const stripe = useStripe();
  const elements = useElements();
  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(formSchema),
    defaultValues:{
        firstName: "",
        lastName: "",
        phoneNumber: "",
        addressLine1: "",
        country: "",
        city: "",
        region: "",
        postalCode: "",
        company: "",
        addressLine2: "" 
    }
  });

  async function onSubmit(data: PaymentMethodForm) {
    if (!stripe || !elements) {
        return; // Make sure Stripe.js has loaded before submitting
      }
  
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        console.error("CardElement not found.");
        return;
    }
    console.log('cardElement ===> ', cardElement);
    try {
        // Call Stripe's createPaymentMethod API
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: `${data.firstName} ${data.lastName}`,
            phone: data.phoneNumber,
            address: {
              line1: data.addressLine1,
              line2: data.addressLine2,
              city: data.city,
              state: data.region,
              postal_code: data.postalCode,
              country: data.country,
            },
          },
        });
        if (error) {
            console.error("Error creating payment method:", error.message);
            return;
          }
        if (paymentMethod) {
            console.log("PaymentMethod created successfully:", paymentMethod.id);
        
            addPaymentMethod({paymentMethodId:paymentMethod.id,customerId:user?.id??""})
            onOpenChange(false);
            form.reset();
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
        
    //api call
    console.log(data);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Payment Method</DialogTitle>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Cardholder Information */}
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cardholder Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input {...field} 
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
                            <Input {...field} 
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
                    name="company"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                        <Input {...field}
                        className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                        <Input {...field} 
                        onChange={(e)=>field.onChange(formatPhoneNumber(e.target.value))}
                        className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>

                {/* Cardholder Address */}
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cardholder Address</h3>
                <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address line 1</FormLabel>
                        <FormControl>
                        <Input {...field}
                        className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address line 2</FormLabel>
                        <FormControl>
                        <Input {...field}
                        className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                        <Input {...field}
                        className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} 
                            className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                            <Input {...field} 
                            className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Postal/Zip</FormLabel>
                        <FormControl>
                            <Input {...field}
                            className="focus:border focus:border-black focus-visible:ring-0 focus-visible:shadow-none" 
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>

                {/* Card Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Card Information</h3>
                    <div className="flex gap-4">
                        <Image
                        src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/visa.svg"
                        alt="Visa" 
                        width={30}
                        height={25}
                        />
                        <Image
                        src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/mastercard.svg"
                        alt="Mastercard"
                        width={30}
                        height={25}
                        />
                        <Image
                        src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat/amex.svg"
                        alt="American Express"
                        width={30}
                        height={25}
                        />
                    </div>
                    <CardElement /> 
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                    </div>
                ) : (
                    "Add Payment Method"
                )}
                </Button>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}