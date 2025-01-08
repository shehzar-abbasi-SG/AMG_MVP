/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  const query = `
    {
      products(first: 10, query: "tag:records") {
        edges {
          node {
            id
            title
            handle
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                      name
                      value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch records products");
    }

    const data = await response.json();
    const records = data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      variants: edge.node.variants.edges.map((variantEdge: any) => ({
        id: variantEdge.node.id,
        title: variantEdge.node.title,
        price: variantEdge.node.price.amount,
        currency: variantEdge.node.price.currencyCode,
      })),
    }));

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching records products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
