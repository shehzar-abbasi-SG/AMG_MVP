'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

interface Variant {
  id: string;
  title: string;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: { name: string; value: string }[];
}

interface Product {
  id: string;
  title: string;
  descriptionHtml: string;
  images: { edges: { node: { src: string; altText: string } }[] };
  variants: { edges: { node: Variant }[] };  // Corrected this line
}

const ProductDetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const {handle} = useParams()
  const {addToCart} = useCart()


  useEffect(() => {
    if (!handle) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${handle}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setProduct(data.data.product);
      } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        }else {
            toast.error("Failed to load product.");
        }
      }
    };

    fetchProduct();
  }, [handle]);

  if (!product) {
    return <div>Loading...</div>; // Optional loading state
  }

  // Safely access the first image or fallback to a default image
  const imageSrc = product.images?.edges?.[0]?.node?.src || "/default-image.png";
  const imageAlt = product.images?.edges?.[0]?.node?.altText || "Product image";

  const handleAddToCart = (product:Product) => {
    const merchandiseId = product.variants.edges[0].node.id;
    addToCart(merchandiseId, 1);
  };


  
  return (
    <section className="p-4">
    <div className="flex gap-6">
      <div className="w-1/2">
        <Image
          alt={imageAlt}
          src={imageSrc}
          width={500}
          height={500}
          className="object-cover w-full h-auto"
        />
      </div>
      <div className="w-1/2">
        <h2 className="font-semibold text-2xl">{product.title}</h2>
        <div
          className="mt-4 text-gray-600"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
        <div className="mt-4 text-xl font-bold">
          ${product.variants?.edges[0].node.priceV2.amount}
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          className="mt-6 px-6 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </section>
  );
};

export default ProductDetailPage;
