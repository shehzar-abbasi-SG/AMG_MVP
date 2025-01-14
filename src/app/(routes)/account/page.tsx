'use client'
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, CreditCard, Plus } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { EditAccountDialog } from "@/components/EditAccountDialog"
import { ForgotPasswordModal } from "@/components/ForgotPasswordDialog"
import { PaymentMethodModal } from "@/components/AddPaymentDialog"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { OrdersTable } from "@/components/OrdersTable"
import { useOrders } from "@/context/OrdersContext"

export default function AccountPage() {
    
    const {user} = useUser()
    const [isEditDialogOpen,setIsEditingDialog] = useState(false)
    const [isForgotPasswordModal,setIsForgotPasswordModal] = useState(false)
    const [isPaymentMethodModal,setIsPayementMethodModal] = useState(false)
    const id ="pk_test_51Qh3OJH2tnv6mDmAvNgAPgongELjfJuA7czKpOJC0ehxy8BipX6Ao4QoU8RU7lv6D7xuNmSSWa3UhepYDQuQOWuX00fU7fksSr"
    const stripePromise = loadStripe(id);
    // const secret = "my-scret"
    const options:StripeElementsOptions = {
        // clientSecret: `${id}_secret_${secret}`,
        appearance: {
          theme: 'stripe',
          labels: 'floating',
          variables: {
            fontFamily: 'Arial, sans-serif',
            borderRadius: '4px',
          },
        },
    
      };

      const {orders} = useOrders()

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-auto p-0 bg-transparent gap-4">
                    <TabsTrigger 
                        value="account" 
                        className="data-[state=active]:border-b-primary
                        data-[state=active]:shadow-none bg-transparent shadow-none rounded-none 
                        data-[state=active]:text-primary
                        font-bold
                        border-b-[2px]
                        border-b-[transparent]
                        "
                    >
                        Account
                    </TabsTrigger>
                    <TabsTrigger 
                        value="orders"
                        className="data-[state=active]:border-b-primary
                        data-[state=active]:shadow-none bg-transparent shadow-none rounded-none 
                        data-[state=active]:text-primary
                        font-bold
                        border-b-[2px]
                        border-b-[transparent]
                        "
                    >
                        Orders
                    </TabsTrigger>
                    <TabsTrigger 
                        value="submissions"
                        className="data-[state=active]:border-b-primary
                        data-[state=active]:shadow-none bg-transparent shadow-none rounded-none 
                        data-[state=active]:text-primary
                        font-bold
                        border-b-[2px]
                        border-b-[transparent]
                        "
                    >
                        Submissions
                    </TabsTrigger>
                    <TabsTrigger 
                        value="addressBook"
                        className="data-[state=active]:border-b-primary
                        data-[state=active]:shadow-none bg-transparent shadow-none rounded-none 
                        data-[state=active]:text-primary
                        font-bold
                        border-b-[2px]
                        border-b-[transparent]
                        "
                    >
                        Address Book
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-8">
                {/* Addresses Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Addresses</h2>
                    <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add a new address
                    </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-[#EBEAE2]">
                        <CardHeader>
                            <CardTitle>Billing Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>Test User</p>
                            <p>Stay GOLD</p>
                            <p>TestAddress Line 1</p>
                            <p>Montreal, Quebec, 123456</p>
                            <p>CA</p>
                            <p>T: 123515612</p>
                            <Button variant="link" className="p-0">Edit</Button>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#EBEAE2]">
                        <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                        <p>Test User</p>
                        <p>Stay GOLD</p>
                        <p>TestAddress Line 1</p>
                        <p>Montreal, Quebec, 123456</p>
                        <p>CA</p>
                        <p>T: 123515612</p>
                        <Button variant="link" className="p-0">Edit</Button>
                        </CardContent>
                    </Card>
                    </div>
                </section>

                {/* Payment Methods Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Payment Methods</h2>
                    <Button variant="outline" onClick={()=>setIsPayementMethodModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add new payment method
                    </Button>
                    </div>
                    <Card className="bg-[#EBEAE2]">
                    <CardContent className="py-4">
                        <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <CreditCard className="h-5 w-5" />
                            <span>•••• •••• •••• 1111</span>
                        </div>
                        <Button variant="ghost" className="text-destructive">Delete</Button>
                        </div>
                    </CardContent>
                    </Card>
                </section>

                {/* Account Information Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
                    <Card className="bg-[#EBEAE2]">
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                    </CardHeader>
                    {user && 
                        <CardContent className="space-y-2">
                            <p>{`${user.firstName} ${user.lastName}`}</p>
                            <p>{user.email}</p>
                            <Button variant="link" className="p-0" onClick={()=>setIsEditingDialog(true)}>Edit Account Details</Button>
                        </CardContent>
                    }
                    </Card>
                </section>

                {/* Password & Security Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Password & Security</h2>
                    <Card className="bg-[#EBEAE2]">
                    <CardContent className="py-4">
                        <Button variant="ghost" className="w-full justify-between" onClick={()=>{setIsForgotPasswordModal(true)}}>
                            Change my password
                        <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                    </Card>
                </section>
                </TabsContent>

                <TabsContent value="orders">
                    {orders && orders.length>0 ? 
                    <OrdersTable orders={orders}/>:
                    <p>No orders</p>
                    }
                </TabsContent>

                <TabsContent value="submissions">
                <Card className="bg-[#EBEAE2]">
                    <CardContent className="py-10 text-center text-muted-foreground">
                    No submissions found
                    </CardContent>
                </Card>
                </TabsContent>

                <TabsContent value="addressBook">
                <Card className="bg-[#EBEAE2]">
                    <CardContent className="py-10 text-center text-muted-foreground">
                    No additional addresses found
                    </CardContent>
                </Card>
                </TabsContent>
            </Tabs>
            <EditAccountDialog open={isEditDialogOpen} onOpenChange={setIsEditingDialog}/>
            <ForgotPasswordModal open={isForgotPasswordModal} onOpenChange={setIsForgotPasswordModal}/>
            <Elements stripe={stripePromise} options={options}>
                <PaymentMethodModal open={isPaymentMethodModal} onOpenChange={setIsPayementMethodModal}/>
            </Elements>

        </div>
    )
}