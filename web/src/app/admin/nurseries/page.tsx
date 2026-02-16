"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { nurseriesApi } from "@/lib/api/admin";
import type { Nursery } from "@/lib/api/types";
import SkeletonTable from "@/components/SkeletonTable";

export default function NurseriesPage() {
  const router = useRouter();
  const [nurseries, setNurseries] = useState<Nursery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNurseries();
  }, []);

  const loadNurseries = async () => {
    try {
      setLoading(true);
      const data = await nurseriesApi.list();
      setNurseries(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load nurseries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await nurseriesApi.delete(id);
      await loadNurseries();
    } catch (err: any) {
      alert(err.message || "Failed to delete nursery");
    }
  };

  if (loading) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-[#111812] dark:text-white">Nurseries</h1>
        </div>
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
          <SkeletonTable rows={5} columns={5} />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-[#111812] dark:text-white">Nurseries</h1>
        <Link
          href="/admin/nurseries/new"
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
        >
          Add Nursery
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
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Commune
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Coordinates
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {nurseries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No nurseries found. Create one to get started.
                  </td>
                </tr>
              ) : (
                nurseries.map((nursery) => (
                  <tr key={nursery.id} className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#111812] dark:text-white">{nursery.internal_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {nursery.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {nursery.commune || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {nursery.latitude && nursery.longitude
                        ? `${parseFloat(nursery.latitude).toFixed(6)}, ${parseFloat(nursery.longitude).toFixed(6)}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/nurseries/${nursery.id}`}
                          className="text-primary hover:text-primary-dark font-medium transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/nurseries/${nursery.id}?edit=true`}
                          className="text-info hover:text-blue-700 font-medium transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(nursery.id, nursery.internal_name)}
                          className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}


