import { SHOPIFY_API_URL, SHOPIFY_ACCESS_TOKEN } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password, resetToken,id } = await req.json();

    if (!password || !resetToken) {
      return NextResponse.json({ error: "Password and reset token are required" }, { status: 400 });
    }

    const query = `
      mutation customerReset($id: ID!, $input: CustomerResetInput!) {
        customerReset(id: $id, input: $input) {
            customer {
                id
            }
            customerAccessToken {
                accessToken
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
        variables: { id :`gid://shopify/Customer/${id}`, input: { password, resetToken } },
      }),
    });

    const data = await response.json();
    console.log('data :>> ', data);
    if(data.errors?.length){
        return NextResponse.json(
            { error: data.errors[0].message },
            { status: 400 }
          );
    }
    else if (data.customerReset?.customerUserErrors?.length) {
      return NextResponse.json(
        { error: data.data.customerReset.customerUserErrors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("error in reset password ==> ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
