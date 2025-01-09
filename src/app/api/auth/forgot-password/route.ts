import { SHOPIFY_API_URL, SHOPIFY_ACCESS_TOKEN } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const query = `
      mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
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
        variables: { email },
      }),
    });

    const data = await response.json();
    console.log('data :>> ', data);
    if(data?.errors?.length){
      return NextResponse.json(
          { error: data.errors[0].message },
          { status: 400 }
        );
  }else if (data.customerRecover?.customerUserErrors.length) {
      return NextResponse.json(
        { error: data.data.customerRecover.customerUserErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Password recovery email sent successfully",
    });
  } catch (error) {
    console.log("error in forgot password ==> ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
