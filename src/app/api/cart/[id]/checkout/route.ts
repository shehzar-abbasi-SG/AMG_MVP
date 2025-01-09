import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }>}) {
    const id  = decodeURIComponent((await params).id);

  const query = `
    query {
      cart(id: "${id}") {
        checkoutUrl
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

    const data = await response.json();

    if (data.errors) {
      console.log("Shopify API error:", data.errors);
      return NextResponse.json({ error: "Error fetching checkout URL" }, { status: 500 });
    }
    console.log('data :>> ', data);
    const checkoutUrl = data.data.cart.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Checkout URL not found" }, { status: 404 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.log("Error fetching checkout URL:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
