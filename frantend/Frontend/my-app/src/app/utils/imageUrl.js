const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/web/";

export const PRODUCT_IMAGE_PLACEHOLDER = "/powder-images/jgb-anti-moisture-bag-25kg.jpg";

export function getBackendUrl() {
  const url = API_URL || "http://localhost:8000/web/";
  return url.replace(/\/web\/?$/, "").replace(/\/$/, "");
}

export function isCompleteImageUrl(src) {
  return /^(https?:)?\/\//i.test(src) || /^(data|blob):/i.test(src);
}

export function buildProductImageUrl(image, baseUrl) {
  const imageName = String(image || "").trim();

  if (!imageName) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (isCompleteImageUrl(imageName) || imageName.startsWith("/")) {
    return imageName;
  }

  const backend = getBackendUrl() || "http://localhost:8000";
  const imageBase = baseUrl || `${backend}/uploads/product/`;

  return `${imageBase.replace(/\/?$/, "/")}${imageName.replace(/^\//, "")}`;
}
