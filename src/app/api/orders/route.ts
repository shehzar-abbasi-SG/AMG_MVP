/* eslint-disable @typescript-eslint/no-explicit-any */
import { SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_ADMIN_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customerId } = await req.json();

  if (!customerId) {
    return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${SHOPIFY_ADMIN_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query: `
          query getCustomerOrders($id: ID!) {
            customer(id: $id) {
              orders(first: 10) {
                edges {
                  node {
                    id
                    name
                    createdAt
                    totalPriceSet {
                      presentmentMoney {
                        amount
                        currencyCode
                      }
                    }
                    displayFulfillmentStatus
                    shippingAddress {
                      name
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: customerId,
        },
      }),
    });

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const orders = data.data.customer.orders.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name,
      date: edge.node.createdAt,
      total: ` ${edge.node.totalPriceSet.presentmentMoney.currencyCode} ${edge.node.totalPriceSet.presentmentMoney.amount}`,
      status: edge.node.displayFulfillmentStatus,
      shipTo: edge.node.shippingAddress?.name || "N/A",
    }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
