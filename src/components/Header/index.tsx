'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import {useRouter} from "next/navigation"
import { useCart } from '@/context/CartContext'
import { ShoppingCartIcon, XMarkIcon,MinusIcon} from '@heroicons/react/16/solid'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useAuth } from '@/context/AuthContext'


function Header() {
    const router = useRouter();
    const { cartItems,removeFromCart,getCheckoutUrl } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const {token,logout} = useAuth()
    const handleLogout = () => {
        logout()
    };
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
   
    const handleCheckout = async () => {
      try {
        const url = await getCheckoutUrl();
        if (url) {
          window.location.href = url; // Redirect to the checkout page
        } else {
          alert("Unable to proceed to checkout");
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Error fetching checkout URL");
      }
    };
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-black">
    <nav className="flex space-x-8">
      <Link href="/about" className="hover:text-gray-600">
        About
      </Link>
      <Link href="/archiving" className="hover:text-gray-600">
        Archiving
      </Link>
      <Link href="/merch" className="hover:text-gray-600">
        Merch
      </Link>
    </nav>

    <div className="flex justify-center flex-grow">
      <Link href="/">
        <Image
          alt="AMG Logo"
          src="/amg.svg"
          className="mx-auto h-10 w-auto"
          width={200}
          height={300}
        />
      </Link>
    </div>
    <div className="flex items-center gap-6">
    {token? 
      <>
        <Link href={"/single-page-form"} className="bg-white text-black border border-black p-2 rounded-full">
          Submit Media
        </Link>
        <button
        onClick={() => setIsCartOpen(true)}
        className="relative text-black"
        >
        <ShoppingCartIcon className="h-6 w-6" />
        {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
            </span>
        )}
        </button>
       
        <button onClick={handleLogout} className="text-black hover:underline">Logout</button>
      </>
      : <button onClick={()=>router.push('/login')} className="text-black hover:underline">Login</button>}
    </div>
    <Dialog
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        as="div"
        // className="relative z-10 focus:outline-none" 
      >
        <div 
         className="fixed inset-0 bg-black opacity-30"
        />
            <DialogPanel 
            transition
           className="fixed inset-0 flex justify-center items-center"
            
            >
            <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
              <button
                className="absolute top-2 right-2"
                onClick={() => setIsCartOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>

              {/* Cart Content */}
              <DialogTitle className="text-lg font-semibold text-black">
                Cart Items
              </DialogTitle>
              <ul className="mt-4 space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                    <div>
                        <p className="text-black font-medium">{item.merchandise.title}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="text-black">
                        ${(Number(item.quantity) * Number(item.merchandise.priceV2.amount)).toFixed(2)}{" "}
                        {item.merchandise.priceV2.currencyCode}
                        </p>
                        
                        {/* Minus icon to remove one item */}
                        <button
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation()
                            removeFromCart(item.id)
                        }}
                        >
                        <MinusIcon className='h-4 w-4' />
                        </button>
                    </div>
                </li>
                  ))
                )}
              </ul>
              <div className="mt-4 flex items-center justify-center gap-x-2">
               
                <button
                  onClick={handleCheckout} // Redirect to Shopify checkout
                  className="bg-black text-white p-2 rounded"
                >
                  Checkout
                </button>
                <button
                  onClick={()=>{setIsCartOpen(false)}} // Close modal
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            
          </DialogPanel>
    </Dialog>
  </header>
  )
}

export default Header