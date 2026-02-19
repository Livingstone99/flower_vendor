"use client";

import Link from "next/link";
import Image from "next/image";

import { careTips } from "./data";

export default function CareTipsPage() {
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
        <span className="text-[#111812] dark:text-white text-sm font-semibold">Care Tips</span>
      </div>

      {/* Page Heading */}
      <div className="mb-12">
        <h1 className="text-[#111812] dark:text-white text-4xl font-bold leading-tight tracking-[-0.033em] mb-4">
          Plant Care Tips
        </h1>
        <p className="text-[#618965] dark:text-primary/70 text-lg font-normal max-w-2xl">
          Expert advice to help your plants thrive. From watering schedules to lighting guides, learn everything you need
          to keep your green friends happy and healthy.
        </p>
      </div>

      {/* Care Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {careTips.map((tip) => (
          <Link
            key={tip.id}
            href={`/care-tips/${tip.id}`}
            className="group bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={tip.imageUrl}
                alt={tip.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{tip.category}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{tip.readTime}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#111812] dark:text-white mb-3 group-hover:text-primary transition-colors">
                {tip.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 font-light leading-relaxed">{tip.description}</p>
              <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-4 transition-all">
                Read Guide <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-16 bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 border border-primary/20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111812] dark:text-white mb-3">
            Get Weekly Care Tips Delivered
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Subscribe to our newsletter and receive expert plant care advice, seasonal tips, and exclusive offers
            straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


