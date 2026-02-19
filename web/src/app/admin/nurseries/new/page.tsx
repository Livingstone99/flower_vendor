"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { nurseriesApi } from "@/lib/api/admin";
import type { CreateNurseryRequest } from "@/lib/api/types";

export default function NewNurseryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateNurseryRequest>({
    internal_name: "",
    city: "",
    commune: null,
    latitude: null,
    longitude: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await nurseriesApi.create(formData);
      router.push("/admin/nurseries");
    } catch (err: any) {
      setError(err.message || "Failed to create nursery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="mb-8">
        <Link
          href="/admin/nurseries"
          className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-4 inline-block"
        >
          ← Back to nurseries
        </Link>
        <h1 className="text-4xl font-semibold text-[#111812] dark:text-white">Create Nursery</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="internal_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Internal Name *
            </label>
            <input
              id="internal_name"
              type="text"
              required
              value={formData.internal_name}
              onChange={(e) => setFormData({ ...formData, internal_name: e.target.value })}
              className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              placeholder="Nursery A"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <input
              id="city"
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              placeholder="Abidjan"
            />
          </div>

          <div>
            <label htmlFor="commune" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Commune
            </label>
            <input
              id="commune"
              type="text"
              value={formData.commune || ""}
              onChange={(e) => setFormData({ ...formData, commune: e.target.value || null })}
              className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
              placeholder="Cocody"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ""}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value || null })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                placeholder="5.359952"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ""}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value || null })}
                className="w-full px-4 py-3 border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-xl bg-white dark:bg-[#102212] focus:outline-none focus:ring-2 focus:ring-primary text-[#111812] dark:text-white"
                placeholder="-4.008256"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Nursery"}
            </button>
            <Link
              href="/admin/nurseries"
              className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-[#2a3a2c] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}


