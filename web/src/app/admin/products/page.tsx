"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { dummyProducts } from "@/lib/dummy-data";
import type { Product } from "@/lib/api/types";
import { delay } from "@/lib/dummy-admin-data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      await delay(300);
      // Convert dummy products to match Product type
      const convertedProducts = dummyProducts.map((p) => ({
        ...p,
        image_url: p.image_url || "",
      })) as Product[];
      setProducts(convertedProducts);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleProductActive = async (product: Product) => {
    try {
      // Update local state for dummy data
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === product.id ? { ...p, active: !p.active } : p
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update product status");
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f4f0] dark:bg-[#102212]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#111812] dark:text-white">{product.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{product.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {product.kind.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#111812] dark:text-white">
                    ${(product.price_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.inventory?.quantity || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        product.active
                          ? "bg-success/20 text-success"
                          : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleProductActive(product)}
                        className="text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        {product.active ? "Deactivate" : "Activate"}
                      </button>
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        className="text-info hover:text-blue-700 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
