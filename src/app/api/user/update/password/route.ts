import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { customerAccessToken, newPassword } = await req.json();

    if (!customerAccessToken || !newPassword) {
      return NextResponse.json(
        { error: "customerAccessToken and newPassword are required" },
        { status: 400 }
      );
    }

    const query = `
      mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
        customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
          customer {
            id
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
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
        variables: {
          customer: { password: newPassword },
          customerAccessToken,
        },
      }),
    });

    const data = await response.json();

    const errors =
      data?.data?.customerUpdate?.customerUserErrors ||
      data?.data?.customerUpdate?.userErrors;
    if (errors?.length > 0) {
      return NextResponse.json(
        { error: errors[0]?.message || "Error updating password" },
        { status: 400 }
      );
    }

    const newAccessToken = data?.data?.customerUpdate?.customerAccessToken;
   

    return NextResponse.json({
      message: "Password updated successfully",
      newAccessToken,
    });
  } catch (error) {
    console.log("Error updating password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
