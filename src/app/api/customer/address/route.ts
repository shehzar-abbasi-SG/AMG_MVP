import { SHOPIFY_API_URL, SHOPIFY_ACCESS_TOKEN } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customerAccessToken, address } = await req.json();

  if (!customerAccessToken || !address) {
    return NextResponse.json({ error: "Access token and address are required" }, { status: 400 });
  }

  const query = `
    mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
      customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
        customerAddress {
          id
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        customerUserErrors {
          message
        }
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
      body: JSON.stringify({
        query,
        variables: { address, customerAccessToken },
      }),
    });

    const data = await response.json();

    if (data.errors || data.data.customerUserErrors?.length) {
        const errors = data.errors || data.data.customerUserErrors;
        return NextResponse.json({ error: errors[0]?.message || "Error updating address." }, { status: 400 });
      }

    return NextResponse.json({
      message: "Address created successfully",
      address: data.data.customerAddressCreate.customerAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
