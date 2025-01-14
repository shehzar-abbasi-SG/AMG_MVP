'use client'
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type TToken ={
  accessToken:string;
  expiresAt: Date
}
interface AuthContextProps {
  token: TToken | null;
  login: (token: TToken) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<TToken | null>(null);
  // const [user,setUser] = useState()
  const router = useRouter()

  const validateCustomerToken = (customerToken:string|null, logoutCallback:()=>Promise<void>)=> {
    try {
      if (!customerToken) {
        logoutCallback();
        return;
      }
  
      const tokenData = JSON.parse(customerToken);
      const { accessToken, expiresAt } = tokenData;
  
      if (!accessToken || !expiresAt) {
        logoutCallback();
        return;
      }
  
      const expiryDate = new Date(expiresAt);
      const now = new Date();
  
      if (expiryDate <= now) {
        // Token expired, logout user
        logoutCallback();
      } else {
        setToken(tokenData)
        return tokenData;
      }
    } catch (error) {
      console.error("Error validating customer token:", error);
      logoutCallback();
    }
  }
  useEffect(() => {
    const storedToken = localStorage.getItem("customerToken");
    console.log('storedToken :>> ', storedToken);
    validateCustomerToken(storedToken,logout)
  }, []);
  const login = (token: TToken) => {
    setToken(token);
    localStorage.setItem("customerToken", JSON.stringify(token));
  };

  async function logout() {
    const customerToken = localStorage.getItem("customerToken");
  
    if (customerToken) {
      const { accessToken } = JSON.parse(customerToken);
  
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });
    }
  
    localStorage.removeItem("customerToken");
    localStorage.removeItem("cartId");
    localStorage.removeItem("checkoutUrl");

    router.replace('/')
    setToken(null)
  }



  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
