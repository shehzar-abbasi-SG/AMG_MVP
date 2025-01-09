import { SHOPIFY_API_URL, SHOPIFY_ACCESS_TOKEN } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is required" }, { status: 400 });
    }

    const query = `
      mutation customerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
          deletedAccessToken
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken: accessToken },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.customerAccessTokenDelete.userErrors.length) {
      const error = data.errors?.[0]?.message || data.data.customerAccessTokenDelete.userErrors[0].message;
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}