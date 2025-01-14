import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentMethodId } = await req.json();

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment Method ID is required" }, { status: 400 });
    }

    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          mutation DeleteCustomerPaymentMethod($paymentMethodId: ID!) {
            customerPaymentMethodDelete(id: $paymentMethodId) {
              deletedCustomerPaymentMethodId
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          paymentMethodId,
        },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.customerPaymentMethodDelete.userErrors.length > 0) {
      const error = data.errors?.[0]?.message || data.data.customerPaymentMethodDelete.userErrors[0]?.message;
      throw new Error(error || "Failed to delete payment method");
    }

    const deletedPaymentMethodId = data.data.customerPaymentMethodDelete.deletedCustomerPaymentMethodId;

    return NextResponse.json({ success: true, deletedPaymentMethodId });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json({ error: error || "Internal server error" }, { status: 500 });
  }
}
