import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
  emptyTitle = "No products found",
}) {
  if (!products.length) {
    return (
      <div className="border border-[#ededed] bg-white px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold text-[#242424]">
          {emptyTitle}
        </h2>

        <p className="mt-3 text-[#686868]">
          Try another search or browse a different category.
        </p>
      </div>
    );
  }

  // Product ko order ke according sequence me lagao
  const sortedProducts = [...products].sort((a, b) => {
    return (Number(a.order) || 0) - (Number(b.order) || 0);
  });


  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedProducts.map((product, index) => (
        <ProductCard
          key={product._id || product.slug || index}
          product={product}
          compact
        />
      ))}
    </div>
  );
}
