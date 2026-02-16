"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, type Product } from "@/lib/dummy-data";

export default function VasesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts({ kind: "vase" });
    setProducts(data);
    setLoading(false);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link
          href="/"
          className="text-[#618965] dark:text-primary/70 text-sm font-medium hover:underline"
        >
          Home
        </Link>
        <span className="text-[#618965] dark:text-primary/70 text-sm">/</span>
        <span className="text-[#111812] dark:text-white text-sm font-semibold">Vases</span>
      </div>

      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#111812] dark:text-white text-4xl font-bold leading-tight tracking-[-0.033em]">
            Artisan Vases
          </h1>
          <p className="text-[#618965] dark:text-primary/70 text-base font-normal">
            Handcrafted ceramic and glass vases to showcase your floral arrangements. Unique designs for every style.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-[#1d2d1e] px-4 py-2 rounded-xl shadow-sm border border-[#f0f4f0] dark:border-[#2a3a2c]">
          <span className="text-sm font-medium text-[#618965] dark:text-primary/70">Sort by:</span>
          <select className="bg-transparent border-none focus:ring-0 text-sm font-bold p-0 cursor-pointer">
            <option>Newest Arrivals</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Popularity</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading vases...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No vases found.</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}


