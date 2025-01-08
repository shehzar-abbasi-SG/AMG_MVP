/* eslint-disable @typescript-eslint/no-explicit-any */
// import { SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_ADMIN_API_URL } from "@/config";
import { SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_ADMIN_API_URL } from "@/config";
import { NextResponse } from "next/server";


export async function GET() {
    const query = `
      query {
        metaobjectByHandle(handle: {handle: "about-us", type: "about_us"}) {
          handle
          type
          fields {
            key
            value
            references(first: 20) {
              nodes {
                ... on Metaobject {
                  handle
                  type
                  fields {
                    key
                    value
                    reference {
                      ... on MediaImage {
                        image {
                          url
                          width
                          height
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
            reference {
              ... on MediaImage {
                image {
                  url
                  width
                  height
                  altText
                }
              }
            }
          }
        }
      }
    `;

  try {
    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();

    if (data.errors) {
      console.error("Shopify API error:", data.errors);
      return NextResponse.json({ error: "Error fetching About page" }, { status: 500 });
    }

    const metaobject = data.data.metaobjectByHandle;

    if (!metaobject) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
    const transformedData = {
        heroTitle: metaobject.fields.find((f:any )=> f.key === 'hero_title')?.value,
        heroImage: metaobject.fields.find((f:any )=> f.key === 'hero_image')?.reference?.image,
        aboutUsSections: metaobject.fields.find((f:any )=> f.key === 'about_us_sections')?.references?.nodes.map((section:any) => ({
          title: section.fields.find((f:any )=> f.key === 'title')?.value,
          subtitle: section.fields.find((f:any )=> f.key === 'subtitle')?.value,
          image: section.fields.find((f:any )=> f.key === 'image')?.reference?.image
        }))
      };
      return NextResponse.json(transformedData);
  }catch (error) {
    console.error("Error fetching About page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}