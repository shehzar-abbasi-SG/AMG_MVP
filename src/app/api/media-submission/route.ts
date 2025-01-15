/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  const query =`{
  products(query: "tag:records", first: 10) {
    edges {
      node {
        id
        title
        handle
        metafields(identifiers: [{key: "type_of_service", namespace: "custom"},{key: "keyhole_mount", namespace: "custom"},{key: "record_displayed", namespace: "custom"},{key: "insurance", namespace: "custom"}]) {
          value
          namespace
          key
        }
        variants(first: 100) {
          edges {
            node {
              id
              selectedOptions {
                name
                value
              }
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}`

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
    console.log('data.data :>> ', data.data.products.edges);
    // const records = data.data.products.edges.map((edge: any) => ({
    //   id: edge.node.id,
    //   title: edge.node.title,
    //   handle: edge.node.handle,
    //   variants: edge.node.variants.edges.map((variantEdge: any) => ({
    //     id: variantEdge.node.id,
    //     title: variantEdge.node.title,
    //     price: variantEdge.node.price.amount,
    //     currency: variantEdge.node.price.currencyCode,
    //   })),
    // }));

    return NextResponse.json({records:[],data:data.data.products.edges});
  } catch (error) {
    console.error("Error fetching records products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
