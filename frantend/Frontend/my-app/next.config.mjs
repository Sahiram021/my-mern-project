/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async headers() {
    const noIndexRoutes = [
      "/cart",
      "/checkout",
      "/wishlist",
      "/my-account",
      "/my-dashboard",
      "/order",
      "/order-details/:path*",
      "/payment-processing",
      "/thank-you",
      "/login-register",
      "/forgot-password",
      "/reset-password/:path*",
      "/change-password",
      "/product-search",
    ];

    return noIndexRoutes.map((source) => ({
      source,
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, noarchive",
        },
      ],
    }));
  },
};

export default nextConfig;
