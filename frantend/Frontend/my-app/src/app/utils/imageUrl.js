const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/";

export const PRODUCT_IMAGE_PLACEHOLDER = "/powder-images/jgb-anti-moisture-bag-25kg.jpg";

export function getBackendUrl() {
  const url = API_URL || "https://jgbmtrading.online/api/web/";
  try {
    return new URL(url).origin;
  } catch {
    return url
      .replace(/\/api\/web\/?$/, "")
      .replace(/\/web\/?$/, "")
      .replace(/\/$/, "");
  }
}

export function isCompleteImageUrl(src) {
  return /^(https?:)?\/\//i.test(src) || /^(data|blob):/i.test(src);
}

export function buildProductImageUrl(image, baseUrl) {
  const imageName = String(image || "").trim();

  if (!imageName) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (isCompleteImageUrl(imageName)) {
    return imageName;
  }

  const backend = getBackendUrl() || "https://jgbmtrading.online";
  if (imageName.startsWith("/uploads/")) {
    return `${backend}${imageName}`;
  }
  if (imageName.startsWith("/")) {
    return imageName;
  }
  const imageBase = baseUrl || `${backend}/uploads/product/`;

  return `${imageBase.replace(/\/?$/, "/")}${imageName.replace(/^\//, "")}`;
}
