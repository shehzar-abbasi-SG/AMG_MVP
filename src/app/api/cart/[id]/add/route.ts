// src/app/api/cart/[id]/add/route.ts
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id  = decodeURIComponent(params.id);
  const { variantId, quantity } = await req.json();
  console.log('id ==> ', id);
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
            cartLinesAdd(
              cartId: "${id}",
              lines: [{ 
                quantity: ${quantity}, 
                merchandiseId: "${variantId}"
              }]
            ) {
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
      }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);

    return NextResponse.json(data.data.cartLinesAdd.cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}
