/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
    const match = cleaned.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?$/);
  
    if (!match) return value;
  
    const [, areaCode, prefix, lineNumber] = match;
    return [
      areaCode,
      prefix ? ` ${prefix}` : "",
      lineNumber ? `-${lineNumber}` : "",
    ]
      .join("")
      .trim();
  };
  
export const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };


export function createProductHashMap(products: any[]): Record<string, string> {
    const productMap: Record<string, string> = {};
  
    products.forEach((product) => {
      product.node.variants.edges.forEach((variantEdge:any) => {
        const variant = variantEdge.node;
        const selectedOptions = variant.selectedOptions.map((option:any) => option.value).join("_").toLowerCase();
        productMap[selectedOptions] = variant.id;
      });
    });
  
    return productMap;
  }


  export function extractProductData(products: any[]): any[] {
    const extractedProducts: any[] = [];
  
    products.forEach((product) => {
      const mediaType = product.node.handle; // Assuming mediaType comes from the product handle
      const metafields = product.node.metafields || [];
  
      const serviceType = getMetafieldValue(metafields, "custom", "type_of_service");
      const displayOption = getMetafieldValue(metafields, "custom", "record_displayed");
  
      product.node.variants.edges.forEach((variantEdge:any) => {
        const variant = variantEdge.node;
        const estimatedValue = getSelectedOptionValue(variant.selectedOptions, "Estimated Value");
        const turnaround = getSelectedOptionValue(variant.selectedOptions, "Expedited Turnaround");
        const authentication = getSelectedOptionValue(variant.selectedOptions, "Autograph Authentication");
  
        if (mediaType && displayOption && serviceType) {
          extractedProducts.push({
            id: variant.id,
            mediaType,
            displayOption,
            estimatedValue: estimatedValue ? parseInt(estimatedValue.split("-")[0]) || 0 : 0, // Convert range to number
            turnaround,
            authentication,
            serviceType,
          });
        }
      });
    });
  
    return extractedProducts;
  }
  
  function getMetafieldValue(metafields: any[], namespace: string, key: string): string | undefined {
    const metafield = metafields.find((field) => field?.namespace === namespace && field?.key === key);
    return metafield ? JSON.parse(metafield.value)[0] : undefined;
  }
  
  function getSelectedOptionValue(selectedOptions: any[], name: string): string | undefined {
    const option = selectedOptions.find((opt) => opt.name.trim() === name);
    return option ? option.value : undefined;
  }
  