import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
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
        variables: { input: { email, password } },
      }),
    });

    const data = await response.json();

    if (data.data.customerAccessTokenCreate.customerUserErrors.length) {
      return NextResponse.json(
        { error: data.data.customerAccessTokenCreate.customerUserErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      token: data.data.customerAccessTokenCreate.customerAccessToken,
    });
  } catch (error) {
    console.log('error in login ===> ', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
