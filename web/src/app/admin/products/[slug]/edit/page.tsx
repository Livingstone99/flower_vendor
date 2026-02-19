"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/lib/api/admin";
import type { Product, ProductKind, PlantEnvironment } from "@/lib/api/types";

export default function EditProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    price_cents: "",
    currency: "USD",
    kind: "plant" as ProductKind,
    active: false,
    plant_environment: "" as PlantEnvironment | "",
    size: "",
    color: "",
    care_instructions: "",
  });

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getBySlug(params.slug);
      setProduct(data);
      setFormData({
        slug: data.slug,
        name: data.name,
        description: data.description || "",
        price_cents: (data.price_cents / 100).toString(),
        currency: data.currency,
        kind: data.kind,
        active: data.active,
        plant_environment: data.attributes?.plant_environment || "",
        size: data.attributes?.size || "",
        color: data.attributes?.color || "",
        care_instructions: data.attributes?.care_instructions || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setError("");
    setSaving(true);

    try {
      await productsApi.update(product.id, {
        slug: formData.slug,
        name: formData.name,
        description: formData.description || undefined,
        price_cents: parseInt(formData.price_cents) * 100,
        currency: formData.currency,
        kind: formData.kind,
        active: formData.active,
        attributes: formData.plant_environment || formData.size || formData.color || formData.care_instructions
          ? {
              plant_environment: formData.plant_environment || undefined,
              size: formData.size || undefined,
              color: formData.color || undefined,
              care_instructions: formData.care_instructions || undefined,
            }
          : undefined,
      });
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-red-600">Product not found</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-4 inline-block"
        >
          ← Back to products
        </Link>
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white">Edit Product</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price_cents}
                onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type *</label>
              <select
                required
                value={formData.kind}
                onChange={(e) => setFormData({ ...formData, kind: e.target.value as ProductKind })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              >
                <option value="plant">Plant</option>
                <option value="bouquet">Bouquet</option>
                <option value="vase">Vase</option>
                <option value="digital_service">Digital Service</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 rounded border-[#f0f4f0] dark:border-[#2a3a2c]"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>
          </div>

          <div className="border-t border-[#f0f4f0] dark:border-[#2a3a2c] pt-6">
            <h3 className="text-lg font-bold text-[#111812] dark:text-white mb-4">Attributes (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Plant Environment
                </label>
                <select
                  value={formData.plant_environment}
                  onChange={(e) =>
                    setFormData({ ...formData, plant_environment: e.target.value as PlantEnvironment | "" })
                  }
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                >
                  <option value="">None</option>
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Care Instructions
                </label>
                <textarea
                  value={formData.care_instructions}
                  onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin/products"
              className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}


