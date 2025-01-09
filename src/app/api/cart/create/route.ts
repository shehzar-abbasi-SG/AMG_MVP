import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const {accessToken} = await req.json()
  if (!accessToken) {
    return NextResponse.json({ error: "Access Token is required" }, { status: 400 });
  }
  try {
    const response = await fetch(`${SHOPIFY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
         mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
              buyerIdentity {
                customer {
                  id
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
        `,
        variables:
        {
          input: {
            buyerIdentity: {
              customerAccessToken: accessToken
            }
          }
        }
      }),
    });

    const data = await response.json();
    console.log('data ====> ', data);

    if (data.errors) throw new Error(data.errors[0].message);

    return NextResponse.json({ cartId: data.data.cartCreate.cart.id,checkoutUrl: data.data.cartCreate.cart.checkoutUrl });
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
  }
}
