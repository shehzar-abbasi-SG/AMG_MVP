import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from "@/config";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const query = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            phone

          }
          customerUserErrors {
            message
          }
        }
      }
    `;

    const customerResponse = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: { input: { email, password,  firstName, lastName, phone } },
      }),
    });
    const customerData = await customerResponse.json();

    if(customerData.errors?.length){
      return NextResponse.json(
          { error: customerData.errors[0].message },
          { status: 400 }
        );
  }
  else if (customerData.data.customerCreate?.customerUserErrors.length>0) {
      return NextResponse.json(
        { error: customerData.data.customerCreate?.customerUserErrors[0].message },
        { status: 400 }
      );
    }
    // const customerId = customerData.data.customerCreate.customer.id;

    // // Call the /api/customer/[id]/metafield route to set metafields
    // const metafields = [
    //   { namespace: "custom", key: "first_name", value: firstName, type: "single_line_text_field" },
    //   { namespace: "custom", key: "last_name", value: lastName, type: "single_line_text_field" },
    // ];
    // const customerIdEncoded = encodeURIComponent(customerId)
    // const metafieldsResponse = await fetch(`/api/customer/${customerIdEncoded}/metafield`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(metafields),
    // });

    // console.log('metafieldsResponse ===> ', metafieldsResponse);


    // const metafieldsData = await metafieldsResponse.json();

    // if (metafieldsData.error) {
    //   return NextResponse.json(
    //     { error: metafieldsData.error },
    //     { status: 400 }
    //   );
    // }
    return NextResponse.json({
      message: "Signup successful and metafields set",
      customer: customerData.data.customerCreate.customer,
    });
    // const response = await fetch(SHOPIFY_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN!,
    //   },
    //   body: JSON.stringify({
    //     query,
    //     variables: { input: { email, password } },
    //   }),
    // });

    // const data = await response.json();

    // if (data.data.customerCreate.customerUserErrors.length) {
    //   return NextResponse.json(
    //     { error: data.data.customerCreate.customerUserErrors[0].message },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json({
      message: "Signup successful",
      customer: customerData.data.customerCreate.customer,
    });
  } catch (error) {
    console.log('error in signup ==> ', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}