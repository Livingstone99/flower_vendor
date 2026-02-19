"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { getProducts, type Product } from "@/lib/dummy-data";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    setLoading(true);
    const all = await getProducts();
    setFeaturedProducts(all.slice(0, 4));
    setLoading(false);
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6">
      {/* Hero Section */}
      <section className="py-8">
        <div
          className="relative min-h-[560px] flex flex-col items-center justify-center rounded-xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200")',
          }}
        >
          <div className="z-10 text-center px-4 max-w-2xl">
            <h1 className="text-white text-5xl md:text-7xl font-semibold leading-tight tracking-tight mb-4">
              Bring Nature Home
            </h1>
            <p className="text-white text-lg md:text-xl font-normal mb-8 opacity-90 leading-relaxed">
              Curated greenery and artisan vases for your sunlit spaces. Sustainably sourced, hand-delivered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-10 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform hover:bg-primary-dark"
              >
                Shop Collections
              </Link>
              <button className="px-10 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold rounded-xl hover:bg-white/30 transition-all">
                View Lookbook
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Indoor Trees */}
          <Link
            href="/shop?kind=plant&plant_environment=indoor"
            className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-white text-2xl font-semibold">Indoor Trees</p>
              <span className="text-primary text-sm font-medium">Explore 24+ Varieties</span>
            </div>
          </Link>

          {/* Dried Flowers */}
          <Link
            href="/shop?kind=bouquet"
            className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1597848212624-e593b98b8c2b?w=800")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-white text-2xl font-semibold">Dried Flowers</p>
              <span className="text-primary text-sm font-medium">Timeless Beauty</span>
            </div>
          </Link>

          {/* Artisan Vases */}
          <Link
            href="/shop?kind=vase"
            className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-white text-2xl font-semibold">Artisan Vases</p>
              <span className="text-primary text-sm font-medium">Handcrafted Ceramics</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Now Carousel */}
      <section className="py-12 bg-white dark:bg-white/5 rounded-3xl px-8 my-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Trending Now</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-2 rounded-full border border-gray-200 dark:border-white/10 hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </section>

      {/* Plant Care Tips */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-8">Plant Care Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-10 flex flex-col md:flex-row gap-8 items-center border border-primary/20">
            <div
              className="w-full md:w-1/3 aspect-square rounded-xl bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400")',
              }}
            />
            <div className="flex-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
                Educational
              </span>
              <h3 className="text-2xl font-semibold mb-3">How to not kill your Succulent</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-normal leading-relaxed">
                Most succulents die from over-watering. Discover the perfect drainage balance and light cycles...
              </p>
              <button className="text-sm font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Read Guide <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-10 flex flex-col md:flex-row gap-8 items-center border border-primary/20">
            <div
              className="w-full md:w-1/3 aspect-square rounded-xl bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400")',
              }}
            />
            <div className="flex-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
                Lifestyle
              </span>
              <h3 className="text-2xl font-semibold mb-3">The Art of Vase Arrangement</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-light leading-relaxed">
                Matching the shape of your vase to your floral stems is an art form. Learn the rules of proportions...
              </p>
              <button className="text-sm font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Read Guide <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 mt-8 mb-20 bg-background-dark text-white rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Join our Green Community</h2>
          <p className="text-white/60 mb-10 font-normal leading-relaxed">
            Get weekly tips on plant care, early access to new collections, and 10% off your first order.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 bg-white/10 border-white/20 rounded-xl px-6 py-4 focus:ring-primary focus:border-primary placeholder:text-white/30 outline-none"
              placeholder="Your email address"
              type="email"
            />
            <button
              className="bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform hover:bg-primary-dark"
              type="submit"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-white/30 mt-4 uppercase tracking-widest">
            No spam, just nature. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </main>
  );
}
