"use client";

import { useState } from "react";

const ProductSearch = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const apibaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim() === "") {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${apibaseUrl}products/search?search=${encodeURIComponent(value)}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Calcium & Moisture Powder..."
        value={search}
        onChange={handleSearch}
      />

      {loading && <p>Searching...</p>}

      {!loading && products.length > 0 && (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <h3>{product.name}</h3>
              <p>₹{Number(product.price || 0).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && search.trim() !== "" && products.length === 0 && (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductSearch;