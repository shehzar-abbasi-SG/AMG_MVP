import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function POST() {
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
            cartCreate {
              cart {
                id
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);

    return NextResponse.json({ cartId: data.data.cartCreate.cart.id });
  } catch (error) {
    console.error("Error creating cart:", error);
    return NextResponse.json({ error: "Failed to create cart" }, { status: 500 });
  }
}
