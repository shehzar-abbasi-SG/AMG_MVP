/* eslint-disable @typescript-eslint/no-explicit-any */

import { AboutPageData, parseRichText } from "@/types/about";
import Image from "next/image";



async function getAboutPageData():Promise<AboutPageData> {
    try {
      const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about`,{
        next: {
          revalidate: 3600 // revalidate every hour
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch About page data');
      }
  
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}
  
export default async function AboutPage() {
    const data = await getAboutPageData();


return (
    <div>
      <section className="relative">
        <Image
          src={data.heroImage.url}
          alt={data.heroImage.altText || 'Hero image'}
          width={data.heroImage.width}
          height={data.heroImage.height}
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl text-white font-bold whitespace-pre-line">
            {data.heroTitle}
          </h1>
        </div>
      </section>
      <div className="max-w-7xl mx-auto py-16 px-4">
        {data.aboutUsSections.map((section, index) => {
          const richTextContent = parseRichText(section.subtitle);
          const textContent = richTextContent?.children?.[0]?.children?.[0]?.value || '';
          return (
            <div 
              key={index}
              className={`flex gap-8 items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              } mb-16`}
            >
              <div className="w-1/2">
                <Image
                  src={section.image.url}
                  alt={section.image.altText || `Section ${index + 1} image`}
                  width={section.image.width}
                  height={section.image.height}
                  className="rounded-lg"
                />
              </div>
              <div className="w-1/2">
                <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                <div 
                  dangerouslySetInnerHTML={{ __html: textContent }}
                  className="prose"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>

);
}