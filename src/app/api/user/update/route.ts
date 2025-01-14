import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { customerAccessToken, customer } = await req.json();

    if (!customerAccessToken || !customer) {
      return NextResponse.json(
        { error: "Customer access token and customer data are required" },
        { status: 400 }
      );
    }

    const query = `
      mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
        customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
          customer {
            firstName
            lastName
            email
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
        variables: { customer, customerAccessToken },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.customerUpdate.customerUserErrors?.length || data.data.customerUpdate.userErrors?.length) {
      const errors = data.errors || data.data.customerUpdate.customerUserErrors || data.data.customerUpdate.userErrors;
      return NextResponse.json({ error: errors[0]?.message || "Error updating customer." }, { status: 400 });
    }

    return NextResponse.json({
      message: "Customer updated successfully",
      customer: data.data.customerUpdate.customer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
