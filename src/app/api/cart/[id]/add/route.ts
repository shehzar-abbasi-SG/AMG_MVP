/* eslint-disable @typescript-eslint/no-unused-vars */
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }>}) {
  
  const id = decodeURIComponent((await params).id);
  const { variantId, quantity, properties } = await req.json();

  try {
    // Build line item dynamically
    const line = {
      quantity,
      merchandiseId: variantId,
      ...(properties && {
        attributes: Object.entries(properties)
          .filter(([_i, value]) => value) 
          .map(([key, value]) => ({ key, value })),
          
      }),
    };

    console.log("line ==> ", line);

    const response = await fetch(`${SHOPIFY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                lines(first: 5) {
                  edges {
                    node {
                      id
                      quantity
                      attributes {
                        key
                        value
                      }
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          priceV2 {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          cartId: id,
          lines: [line],
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Error:", data.errors);
      throw new Error(data.errors[0].message);
    }

    if (!data.data?.cartLinesAdd?.cart) {
      throw new Error("Unexpected API response");
    }

    return NextResponse.json(data.data.cartLinesAdd.cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
