"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, type Product } from "@/lib/dummy-data";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    const data = await getProductBySlug(slug);
    setProduct(data);
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-12">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const price = (product.price_cents / 100).toFixed(2);

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/" className="text-[#618965] dark:text-primary/70 text-sm font-medium hover:underline">
          Home
        </Link>
        <span className="text-[#618965] dark:text-primary/70 text-sm">/</span>
        <Link href="/shop" className="text-[#618965] dark:text-primary/70 text-sm font-medium hover:underline">
          Shop
        </Link>
        <span className="text-[#618965] dark:text-primary/70 text-sm">/</span>
        <span className="text-[#111812] dark:text-white text-sm font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative w-full aspect-square bg-white dark:bg-[#1d2d1e] rounded-2xl overflow-hidden border border-[#f0f4f0] dark:border-[#2a3a2c]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-3">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">${price}</p>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">{product.description}</p>

          {product.attributes && (
            <div className="mb-8 space-y-4">
              {product.attributes.plant_environment && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">home</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Environment: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {product.attributes.plant_environment}
                    </span>
                  </div>
                </div>
              )}
              {product.attributes.size && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">straighten</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Size: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {product.attributes.size}
                    </span>
                  </div>
                </div>
              )}
              {product.attributes.color && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">palette</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Color: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{product.attributes.color}</span>
                  </div>
                </div>
              )}
              {product.attributes.care_instructions && (
                <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Care Instructions</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {product.attributes.care_instructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {product.inventory && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.inventory.quantity > 0 ? (
                  <span className="text-success font-semibold">{product.inventory.quantity} in stock</span>
                ) : (
                  <span className="text-error font-semibold">Out of stock</span>
                )}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity:</label>
            <div className="flex items-center border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 bg-white dark:bg-[#1d2d1e] hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <input
                type="number"
                min="1"
                max={product.inventory?.quantity || 10}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.inventory?.quantity || 10)))}
                className="w-20 px-4 py-2 text-center border-x border-[#f0f4f0] dark:border-[#2a3a2c] bg-white dark:bg-[#1d2d1e] focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setQuantity(Math.min((product.inventory?.quantity || 10), quantity + 1))}
                className="px-4 py-2 bg-white dark:bg-[#1d2d1e] hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inventory || product.inventory.quantity === 0}
              className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button className="p-4 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1d2d1e] transition-colors">
              <span className="material-symbols-outlined text-[24px]">favorite</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
