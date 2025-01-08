import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ handle: string }> }) {
  const {handle} = await  params;
  const query = `
      query GetProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          descriptionHtml
          images(first: 5) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                priceV2 {
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
        
          productType
          vendor
          collections(first: 5) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
  `;

  const variables = { handle: handle };

  try {
    const response = await fetch(`${SHOPIFY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("Shopify API error:", text);
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();

    if (!data.data || !data.data.product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { product: data.data.product } });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
