"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  fetchUser: (email: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateUserPassword:(newPassword:string)=>Promise<void>;
  addPaymentMethod:({paymentMethodId,customerId}:{paymentMethodId:string,customerId:string})=>Promise<void>;
  deletePaymentMethod:(paymentMethodId:string)=>Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {token,login:updateToken,logout} = useAuth()
  

  const fetchUser = async (token:string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken:token }),
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data.customer);
      } else {
        console.error("Error fetching user:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({customer:userData,customerAccessToken:token?.accessToken}),
      });
      const data = await response.json();

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          ...data.customer,
        }));
        toast.success(data.message)
      } else {
        toast.error(data.message)
        console.log("Error updating user:", data.error);
      }
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error(error)
    } finally {
      setIsLoading(false);
    }
  };
  const updateUserPassword = async (newPassword:string)=>{
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({newPassword,customerAccessToken:token?.accessToken}),
      });
      const data = await response.json();

      if (response.ok) {
        const { newAccessToken } = data;
        if (!newAccessToken) {
          toast.error("Failed to retrieve new access token. Logging out...")
          console.log("Failed to retrieve new access token. Logging out...");
          logout();
          return;
        }
        updateToken(data.newAccessToken)
        toast.success(data.message)
      } else {
        toast.error(data.message)
        console.log("Error updating user:", data.error);
      }
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error(error)
    } finally {
      setIsLoading(false);
    }
  }
  const addPaymentMethod = async ({paymentMethodId,customerId}:{paymentMethodId: string, customerId: string}) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/payment-method/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId, customerId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add payment method');
      }
      toast.success('Payment method added')
      console.log('Payment method added:', data.paymentMethodId);
    } catch (error) {
      console.log('Error adding payment method:', error);
      toast.error(error)
    }finally{
      setIsLoading(false)
    }
  };
  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/payment-method/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete payment method');
      }
      toast.success('Payment method deleted')
      console.log('Payment method deleted:', data.deletedPaymentMethodId);
    } catch (error) {
      console.log('Error deleting payment method:', error);
      toast.error(error)
    }finally{
      setIsLoading(false)
    }
  };

  
  useEffect(()=>{
    if(!token) return 
    fetchUser(token.accessToken)
  },[token])

  return (
    <UserContext.Provider value={{ user, isLoading, fetchUser, updateUser,updateUserPassword,addPaymentMethod,deletePaymentMethod}}>
      {children}
    </UserContext.Provider>
  )
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
