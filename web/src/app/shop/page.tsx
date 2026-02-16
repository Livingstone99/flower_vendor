"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, type Product, type ProductKind, type PlantEnvironment } from "@/lib/dummy-data";
import { useCart } from "@/lib/cart-context";
import SkeletonProductGrid from "@/components/SkeletonProductGrid";

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    kind?: ProductKind;
    plant_environment?: PlantEnvironment;
    q?: string;
  }>({});
  const [lightFilter, setLightFilter] = useState<string[]>([]);
  const [petFriendly, setPetFriendly] = useState(false);
  const [sizeFilter, setSizeFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(500);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getProducts(filters);
    setProducts(data);
    setLoading(false);
  };

  const handleQuickAdd = (product: Product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  const getLightIcon = (product: Product) => {
    if (product.attributes?.plant_environment === "indoor") {
      return "bedtime"; // Low light
    }
    return "wb_sunny"; // Bright light
  };

  const getSize = (product: Product) => {
    const size = product.attributes?.size?.toLowerCase() || "medium";
    if (size.includes("small")) return "Small";
    if (size.includes("large")) return "Large";
    return "Med";
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
        <span className="text-[#111812] dark:text-white text-sm font-semibold">
          {filters.kind ? filters.kind.charAt(0).toUpperCase() + filters.kind.slice(1) : "All Products"}
        </span>
      </div>

      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#111812] dark:text-white text-4xl font-semibold leading-tight tracking-[-0.033em]">
            {filters.kind ? filters.kind.charAt(0).toUpperCase() + filters.kind.slice(1) : "All Products"}
          </h1>
          <p className="text-[#618965] dark:text-primary/70 text-base font-normal">
            Discover over {products.length}+ curated green companions for your living space.
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation (Filters) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-[#1d2d1e] rounded-xl p-6 shadow-sm border border-[#f0f4f0] dark:border-[#2a3a2c] sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#111812] dark:text-white text-lg font-semibold">Filters</h3>
              <button
                onClick={() => {
                  setFilters({});
                  setLightFilter([]);
                  setPetFriendly(false);
                  setSizeFilter(null);
                  setPriceRange(500);
                }}
                className="text-primary text-xs font-semibold uppercase tracking-wider hover:opacity-80"
              >
                Reset
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {/* Light Requirements Checklist */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#111812] dark:text-white mb-2">
                  <span className="material-symbols-outlined text-[20px]">light_mode</span>
                  <span className="text-sm font-semibold uppercase tracking-tight">Light</span>
                </div>
                <div className="space-y-1">
                  {["Low Light", "Medium Light", "Bright Light"].map((light) => (
                    <label
                      key={light}
                      className="flex items-center gap-3 py-2 cursor-pointer group"
                    >
                      <input
                        className="h-5 w-5 rounded border-[#dbe6dc] dark:border-[#2a3a2c] bg-transparent text-primary focus:ring-0 focus:ring-offset-0 transition-all checked:bg-primary"
                        type="checkbox"
                        checked={lightFilter.includes(light)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLightFilter([...lightFilter, light]);
                          } else {
                            setLightFilter(lightFilter.filter((l) => l !== light));
                          }
                        }}
                      />
                      <span className="text-sm text-[#111812] dark:text-white group-hover:text-primary transition-colors">
                        {light}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pet Friendly Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#111812] dark:text-white mb-2">
                  <span className="material-symbols-outlined text-[20px]">pets</span>
                  <span className="text-sm font-semibold uppercase tracking-tight">Safety</span>
                </div>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-[#111812] dark:text-white">Pet Friendly</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      type="checkbox"
                      checked={petFriendly}
                      onChange={(e) => setPetFriendly(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#2a3a2c] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary" />
                  </div>
                </label>
              </div>

              {/* Size Filter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#111812] dark:text-white mb-2">
                  <span className="material-symbols-outlined text-[20px]">straighten</span>
                  <span className="text-sm font-semibold uppercase tracking-tight">Size</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Small", "Med", "Large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                      className={`px-2 py-2 text-xs font-semibold border rounded-lg transition-all ${sizeFilter === size
                          ? "border-primary text-primary bg-primary/10"
                          : "border-[#dbe6dc] dark:border-[#2a3a2c] hover:border-primary hover:text-primary bg-white dark:bg-[#102212]"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#111812] dark:text-white mb-2">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                  <span className="text-sm font-semibold uppercase tracking-tight">Price Range</span>
                </div>
                <div className="px-2">
                  <input
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-[#2a3a2c]"
                    type="range"
                    min="10"
                    max="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                  />
                  <div className="flex justify-between mt-2 text-xs font-medium text-[#618965] dark:text-primary/70">
                    <span>$10</span>
                    <span>${priceRange}+</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={loadProducts}
              className="w-full mt-10 py-3 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {loading ? (
            <SkeletonProductGrid count={6} />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => {
                  const price = (product.price_cents / 100).toFixed(2);
                  const badge = index === 0 ? "Best Seller" : index === 1 ? "New Arrival" : index === 3 ? "Limited Stock" : null;
                  const badgeColor =
                    badge === "Best Seller"
                      ? "bg-primary"
                      : badge === "New Arrival"
                        ? "bg-[#111812]"
                        : "bg-red-500";

                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col bg-white dark:bg-[#1d2d1e] rounded-2xl overflow-hidden border border-[#f0f4f0] dark:border-[#2a3a2c] hover:shadow-xl transition-all"
                    >
                      <Link href={`/p/${product.slug}`} className="relative aspect-[4/5] overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        {badge && (
                          <div className="absolute top-4 left-4">
                            <span
                              className={`${badgeColor} text-white text-[10px] font-semibold uppercase px-2 py-1 rounded-full`}
                            >
                              {badge}
                            </span>
                          </div>
                        )}
                        <button
                          className="absolute top-4 right-4 bg-white/80 dark:bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Add to favorites
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">favorite</span>
                        </button>
                      </Link>
                      <div className="p-5 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/p/${product.slug}`}>
                              <h3 className="text-lg font-semibold text-[#111812] dark:text-white group-hover:text-primary transition-colors leading-tight">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-xs italic text-[#618965] dark:text-primary/70 font-medium">
                              {product.kind === "plant" ? product.name : product.kind}
                            </p>
                          </div>
                          <span className="text-xl font-semibold text-[#111812] dark:text-white">
                            ${price}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex gap-1 text-[#618965] dark:text-primary/70">
                            <span
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {getLightIcon(product)}
                            </span>
                            {petFriendly && (
                              <span className="material-symbols-outlined text-[16px]">pets</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="flex-1 bg-primary/10 dark:bg-primary/20 hover:bg-primary hover:text-white text-[#111812] dark:text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all"
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-16 flex items-center justify-center gap-2">
                <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-xl bg-primary text-white font-bold">1</button>
                <button className="w-10 h-10 rounded-xl bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] hover:bg-primary/20 transition-all">
                  2
                </button>
                <button className="w-10 h-10 rounded-xl bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] hover:bg-primary/20 transition-all">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="w-10 h-10 rounded-xl bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] hover:bg-primary/20 transition-all">
                  12
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
