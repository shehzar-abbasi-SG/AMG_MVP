import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id  = decodeURIComponent(params.id);

  try {
    const response = await fetch(`${SHOPIFY_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          query {
            cart(id: "${id}") {
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
        `,
      }),
    });

    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);

    return NextResponse.json(data.data.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
