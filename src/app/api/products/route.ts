// app/api/products/route.ts
import { SHOPIFY_ACCESS_TOKEN, SHOPIFY_API_URL } from '@/config';
import { NextResponse } from 'next/server';


export async function GET() {
  const query = `
    {
      products(first: 10,query: "tag:merch") {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
 
    const data = await response.json();

    return NextResponse.json(data);
  }  catch (error) {
    console.log('error in login ===> ', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
