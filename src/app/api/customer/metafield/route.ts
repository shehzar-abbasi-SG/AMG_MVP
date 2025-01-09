import { NextRequest, NextResponse } from "next/server";
import { SHOPIFY_ADMIN_API_URL, SHOPIFY_ADMIN_ACCESS_TOKEN } from "@/config";

export async function POST(req: NextRequest) {
  try {
    const metafields = await req.json();

    if (!metafields || !Array.isArray(metafields)) {
      return NextResponse.json(
        { error: "Customer ID and an array of metafields are required." },
        { status: 400 }
      );
    }

    const query = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      metafields,
    };

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.errors || data.data?.metafieldsSet?.userErrors?.length) {
      return NextResponse.json(
        { error: data.errors?.[0]?.message || data.data.metafieldsSet.userErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Metafields updated successfully.",
      metafields: data.data.metafieldsSet.metafields,
    });
  } catch (error) {
    console.error("Error updating metafields:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
