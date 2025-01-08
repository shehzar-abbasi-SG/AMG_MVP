/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      priceV2: {
        amount: string;
        currencyCode: string;
      };
    };
  }

interface CartContextProps {
  cartId: string | null;
  cartItems: CartItem[];
  createCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  getCheckoutUrl:() => Promise<string | null>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart ID from localStorage on mount
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      console.log('storedCartId :>> ', storedCartId);
      setCartId(storedCartId);
      fetchCart(); 
    }
  }, []);

  // Save cart ID to localStorage whenever it changes
  useEffect(() => {
    if (cartId) {
      localStorage.setItem("cartId", cartId);
      fetchCart(); 
    }
  }, [cartId]);

  // Create a new cart
  const createCart = async () => {
    try {
      const response = await fetch("/api/cart/create", {
        method: "POST",
      });
      const data = await response.json();
      setCartId(data.cartId);
      return data.cartId
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  };

  // Fetch cart details
  const fetchCart = async () => {
    if (!cartId) return;

    try {
      const encodedCartId = encodeURIComponent(cartId)
      const response = await fetch(`/api/cart/${encodedCartId}`);
      const data = await response.json();
      setCartItems(data.lines.edges.map((edge: any) => edge.node));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (merchandiseId: string, quantity: number) => {
    console.log('merchandiseId :==> ', merchandiseId);
    console.log('quantity :==> ', quantity);

    try {
      let existingCartId = cartId
      if (!existingCartId) {
        existingCartId = await createCart()
      }
      const encodedCartId = encodeURIComponent(existingCartId!)
      const response = await fetch(`/api/cart/${encodedCartId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId:merchandiseId, quantity }),
      });
      const data = await response.json();
      console.log('data ==> ', data);
      setCartItems(data.lines.edges.map((edge: any) => edge.node)); // Update cart items
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Remove item from the cart
  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;

    try {
      const encodedCartId = encodeURIComponent(cartId!)
      const response = await fetch(`/api/cart/${encodedCartId}/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineIds: [lineId] }),
      });
      const data = await response.json();
      setCartItems(data.lines.edges.map((edge: any) => edge.node)); // Update cart items
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };


  const getCheckoutUrl = async (): Promise<string | null> => {
    if (!cartId) {
      console.error("Cart ID is missing");
      return null;
    }

    try {
      const encodedCartId = encodeURIComponent(cartId)
      const response = await fetch(`/api/cart/${encodedCartId}/checkout`);
      const data = await response.json();

      if (response.ok) {
        return data.checkoutUrl;
      } else {
        console.error("Error fetching checkout URL:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching checkout URL:", error);
      return null;
    }
  };
  return (
    <CartContext.Provider
      value={{
        cartId,
        cartItems,
        createCart,
        fetchCart,
        addToCart,
        removeFromCart,
        getCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
