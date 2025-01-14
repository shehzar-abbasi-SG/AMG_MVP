import { SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_ADMIN_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentMethodId, customerId } = await req.json();

    if (!paymentMethodId || !customerId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          mutation AddCustomerPaymentMethod($customerId: ID!, $paymentMethodId: String!) {
            customerPaymentMethodRemoteCreate(
              customerId: $customerId,
              paymentMethod: {
                stripePaymentMethod: {
                  customerId: $customerId,
                  paymentMethodId: $paymentMethodId
                }
              }
            ) {
              customerPaymentMethod {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          customerId,
          paymentMethodId,
        },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.customerPaymentMethodRemoteCreate.userErrors.length > 0) {
      const error = data.errors?.[0]?.message || data.data.customerPaymentMethodRemoteCreate.userErrors[0]?.message;
      throw new Error(error || "Failed to add payment method");
    }

    const addedPaymentMethodId = data.data.customerPaymentMethodRemoteCreate.customerPaymentMethod.id;

    return NextResponse.json({ success: true, paymentMethodId: addedPaymentMethodId });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return NextResponse.json({ error: error || "Internal server error" }, { status: 500 });
  }
}
