
interface ImageData {
    url: string;
    width: number;
    height: number;
    altText: string;
  }
  
  interface RichTextNode {
    type: string;
    value?: string;
    url?: string;
    title?: string;
    target?: string;
    children?: RichTextNode[];
  }
  
  interface RichTextContent {
    type: string;
    children: RichTextNode[];
  }
  
  interface AboutSection {
    title: string;
    subtitle: string; 
    image: ImageData;
  }
  
  interface AboutPageData {
    heroTitle: string;
    heroImage: ImageData;
    aboutUsSections: AboutSection[];
  }
  
  const parseRichText = (jsonString: string): RichTextContent => {
    return JSON.parse(jsonString);
  };
  
  export type { AboutPageData, ImageData, AboutSection, RichTextContent };
  export { parseRichText };