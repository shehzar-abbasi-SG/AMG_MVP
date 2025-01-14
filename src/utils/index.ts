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