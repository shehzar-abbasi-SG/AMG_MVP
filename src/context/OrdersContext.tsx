"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";

export type OrderStatus = 'IN_PROGRESS' | 'FULFILLED' | 'ON_HOLD' | 'UNFULFILLED'|'PARTIALLY_FULFILLED'|'PENDING_FULFILLMENT'

export interface Order {
    name:string;
    id: string;
    date: string;
    shipTo: string;
    total: string;
    status: OrderStatus;
}

interface OrdersContextProps {
  orders: Order[] | null;
  isLoading: boolean;
  getOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextProps | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {user} = useUser()

  const getOrders = async () => {
    if (!user) {
      toast.error("No access token available.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      } else {
        toast.error(data.error || "Failed to fetch orders.");
        console.error("Error fetching orders:", data.error);
      }
    } catch (error) {
      toast.error("Error fetching orders.");
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getOrders();
    }
  }, [user]);

  return (
    <OrdersContext.Provider value={{ orders, isLoading, getOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};
