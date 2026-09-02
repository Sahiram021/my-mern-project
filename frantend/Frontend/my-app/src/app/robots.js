const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jgbmtrading.online";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/cart",
          "/checkout",
          "/wishlist",
          "/my-account",
          "/my-dashboard",
          "/order",
          "/order-details/",
          "/payment-processing",
          "/thank-you",
          "/login-register",
          "/forgot-password",
          "/reset-password/",
          "/change-password",
          "/product-search",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
