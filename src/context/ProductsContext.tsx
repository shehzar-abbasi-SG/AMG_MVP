/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { extractProductData } from "@/utils";
// import toast from "react-hot-toast";

// export interface Product {
//   any
// }

interface ProductsContextProps {
  products: any[]
  isLoading: boolean;
  fetchProducts: (email: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {token} = useAuth()
  

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/media-submission", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('data ===> ', data.data);
        try{
          const products = extractProductData(data.data)
          console.log('mapping ==> ', products);
          setProducts(products);

        }catch(err){
          console.log('err :>> ', err)
        }
      } else {
        console.error("Error fetching user:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };


  
  useEffect(()=>{
    if(!token) return 
    fetchProducts()
  },[token])

  return (
    <ProductsContext.Provider value={{ products, isLoading, fetchProducts}}>
      {children}
    </ProductsContext.Provider>
  )
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
