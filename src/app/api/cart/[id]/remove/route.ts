// src/app/api/cart/[id]/remove/route.ts
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params; // Cart ID
  const { lineIds } = await req.json(); 

  try {
    const response = await fetch(`${SHOPIFY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          mutation {
            cartLinesRemove(cartId: "${id}", lineIds: ${JSON.stringify(lineIds)}) {
              cart {
                id
                lines(first: 5) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                        }
                      }
                    }
                  }
                }
                estimatedCost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);

    return NextResponse.json(data.data.cartLinesRemove.cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}
