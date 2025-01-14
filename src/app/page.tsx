/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation"
import Image from "next/image";
import toast from "react-hot-toast";
import Product from "@/components/Product";


export interface Product {
  id: string;
  title: string;
  descriptionHtml: string;
  images: { edges: { node: { src: string; altText: string } }[] };
  handle:string
}

export default function Home() {

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const handleProductClick = (productHandle: string) => {
    router.push(`/product/${productHandle}`);
  };

console.log('products :>> ', products);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setProducts(data.data.products.edges.map((edge: any) => edge.node));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        else {
          toast.error("Failed to load products.");
        }
      }
    };

    fetchProducts();
  }, []);

  return (
   <>
      <section className="min-h-[calc(100vh_-_400px)] flex items-center px-10">
        <h1 className="text-6xl font-bold">Welcome to AMG</h1>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 px-10">
        {products.map((product) => {
          const imageSrc = product.images?.edges?.[0]?.node?.src || "/default-image.png";
          const imageAlt = product.images?.edges?.[0]?.node?.altText || "Product image";
          return(
            <div
              key={product.handle}
              onClick={() => handleProductClick(product.handle)}
              className="border border-gray-300 p-4 cursor-pointer hover:shadow-lg transition"
            >
              <Image
                alt={imageAlt}
                src={imageSrc}
                width={200}
                height={200}
                className="w-full h-auto object-cover"
              />
              <h2 className="font-semibold text-lg mt-2">{product.title}</h2>
              <div
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )})}
      </section>
  </>
  );
};
