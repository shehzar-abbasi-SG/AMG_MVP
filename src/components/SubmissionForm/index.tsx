/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useProducts } from "@/context/ProductsContext"
import { useCart } from "@/context/CartContext"
import toast from "react-hot-toast"

const submissionFormSchema = z.object({
  mediaType: z.enum(["vinyl", "cd", "cassette", "8track"], {
    required_error: "Please select a media type",
  }),
  artist: z.string().min(1, "Artist name is required"),
  albumName: z.string().min(1, "Album name is required"),
  recordLabel: z.string().min(1, "Record label is required"),
  catalogNumber: z.string().optional(),
  releaseYear: z.string().optional(),
  discogs: z.string().optional(),
  notes: z.string().optional(),
  displayOption: z.enum(["sealed", "openFront", "openRight", "custom"], {
    required_error: "Please select a display option",
  }),
  customLayoutNote: z.string().optional(),
  estimatedValue: z.number().min(0).max(10000),
  insuranceAmount: z.string().min(1, "Insurance amount is required"),
  turnaround: z.enum(["none", "7 Day Express", "48 Hour Express"], {
    required_error: "Please select a turnaround option",
  }),
  authentication: z.enum(["none", "JSA Letter of Authenticity (LOA) Only" ,"JSA Letter of Authenticity (LOA) & Autograph Grading"], {
    required_error: "Please select an authentication option",
  }),
  serviceType: z.enum(["grading", "archiving"], {
    required_error: "Please select a service type",
  }),
})

type SubmissionFormValues = z.infer<typeof submissionFormSchema>

export function SubmissionForm() {
    const {products} = useProducts()
    const {addToCart} = useCart()
    const form = useForm<SubmissionFormValues>({
        resolver: zodResolver(submissionFormSchema),
        defaultValues: {
        mediaType: "vinyl",
        displayOption: "sealed",
        turnaround: "none",
        authentication: "none",
        serviceType: "grading",
        estimatedValue: 0,
        artist:"",
        albumName:"",
        recordLabel:"",
        catalogNumber:"",
        releaseYear:"",
        discogs:"",
        notes:"",
        customLayoutNote:"",
        insuranceAmount:'0'
        },
    })

    const findProduct = (searchCriteria: any) => {
        return products.find((product) =>
          Object.keys(searchCriteria).every((key) => String(product[key]).toLowerCase() === String(searchCriteria[key]).toLowerCase())
        );
      }
    function onSubmit(data: SubmissionFormValues) {
        console.log(data)
        const {mediaType,displayOption,estimatedValue,turnaround,authentication,serviceType} = data
        const product = {
            mediaType,
            displayOption,
            estimatedValue,
            turnaround,
            authentication,
            serviceType
        }
        console.log('produc to be found ==> ', product);
        console.log('found product ==> ', findProduct(product));
        const foundProduct = findProduct(product)
        if(foundProduct){
          const lineItemProperties = {
            "Media Type": foundProduct.mediaType,
            "Artist Name": data.artist,
            "Album Name": data.albumName,
            "Record Label": data.recordLabel,
            "Catalog Number": data.catalogNumber,
            "Release Year": data.releaseYear,
            "Discogs": data.discogs,
            "Notes": data.notes,
            "Display Option": data.displayOption,
            "Custom Layout Note": data.customLayoutNote, 
            "Insurance Amount": data.insuranceAmount,
            "Service Type": data.serviceType
          }
          addToCart(foundProduct.id,1,true,lineItemProperties)
        }else{
          toast('The product with this configuration might not be added to Shopify yet. Try another configuration.',
            {
              icon: '🙁',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
          );
        }
        
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Media Type Selection */}
        <FormField
          control={form.control}
          name="mediaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What type of media are you submitting?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-4 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="vinyl"
                        id="vinyl"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="vinyl"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Vinyl</span>
                      <span className="text-xs">Starting at $75</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="cd"
                        id="cd"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="cd"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>CD</span>
                      <span className="text-xs">Starting at $50</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="cassette"
                        id="cassette"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="cassette"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Cassette</span>
                      <span className="text-xs">Starting at $50</span>
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="8track"
                        id="8track"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="8track"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>8 Track</span>
                      <span className="text-xs">Starting at $50</span>
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Album Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tell us a few details about the album</h2>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="albumName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recordLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="catalogNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog Number (If Known)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year (If Known)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discogs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discogs ID (If Known)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any notes about this submission that you would like to share?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Display Options */}
        <FormField
          control={form.control}
          name="displayOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How do you want your record displayed?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-4 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="sealed"
                        id="sealed"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="sealed"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Sealed
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="openFront"
                        id="openFront"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="openFront"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Open (CD in front)
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="openRight"
                        id="openRight"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="openRight"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Open (CD to right)
                    </FormLabel>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem
                        value="custom"
                        id="custom"
                        className="peer sr-only"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="custom"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Custom Layout
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Custom Layout Note */}
        {form.watch("displayOption") === "custom" && (
          <FormField
            control={form.control}
            name="customLayoutNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Layout Note</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Please describe your preferred custom layout"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Estimated Value */}
        <FormField
          control={form.control}
          name="estimatedValue"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>What is the estimated value of your record?</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="rounded-md bg-secondary/50 p-4 text-center font-semibold">
                    ${value.toFixed(2)}
                  </div>
                  <Slider
                    min={0}
                    max={10000}
                    step={500}
                    value={[value]}
                    onValueChange={([newValue]) => onChange(newValue)}
                    className="w-full"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Move the slider to set the estimated value
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Insurance Amount */}
        <FormField
          control={form.control}
          name="insuranceAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How much would you like to insure your item?</FormLabel>
              <FormDescription>
                This helps protect your items and guarantees they&apos;re insured for their full value in case of any issues.
              </FormDescription>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Turnaround Time */}
        <FormField
          control={form.control}
          name="turnaround"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you need expedited turnaround?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      None
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="7 Day Express" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      7 Day Express (+$50)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="48 Hour Express" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      48 Hour Express (+$100)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Authentication Options */}
        <FormField
          control={form.control}
          name="authentication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Options</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      None
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="JSA Letter of Authenticity (LOA) Only" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      JSA Letter of Authenticity (LOA) Only (+$50)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="JSA Letter of Authenticity (LOA) & Autograph Grading" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      JSA Letter of Authenticity (LOA) & Autograph Grading (+$75)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Type */}
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Service</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="grading" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Grading (We authenticate, document, label and case with a grade)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="archiving" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Archiving (We authenticate, document, label and case without a grade)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}


