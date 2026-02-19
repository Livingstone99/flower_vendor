"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserDetail, getUserById } from "@/lib/dummy-super-admin-data";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = (session as any)?.role;
      if (userRole !== "super_admin") {
        router.push("/dashboard");
      } else {
        loadUser();
      }
    } else if (status === "unauthenticated") {
      router.push("/checkout");
    }
  }, [status, session, router, params.id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(parseInt(params.id));
      if (!data) {
        setError("User not found");
      } else {
        setUser(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading user details...</p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-400">
          {error || "User not found"}
        </div>
        <Link
          href="/super-admin/users"
          className="text-primary hover:text-primary-dark font-semibold text-sm mt-4 inline-block"
        >
          ← Back to Users
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <Link
        href="/super-admin/users"
        className="text-primary hover:text-primary-dark font-semibold text-sm mb-4 inline-block"
      >
        ← Back to Users
      </Link>

      <div className="mb-8 p-6 bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase">
            {user.name ? user.name.charAt(0) : user.email.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111812] dark:text-white">{user.name || "Unknown User"}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-xl font-semibold text-sm uppercase tracking-wide ${user.status === "active"
              ? "bg-success/20 text-success"
              : user.status === "suspended"
                ? "bg-error/20 text-error"
                : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-500"
            }`}
        >
          {user.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Profile Details</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
                <span className="text-gray-500 dark:text-gray-400">Role</span>
                <span className="font-semibold text-[#111812] dark:text-white capitalize">{user.role.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
                <span className="text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="font-semibold text-[#111812] dark:text-white">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Last Login</span>
                <span className="font-semibold text-[#111812] dark:text-white">
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Activity Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-[#111812] dark:text-white">{user.orders_count}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl text-center">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total Spend</p>
                <p className="text-2xl font-bold text-success">${(user.total_spend_cents / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-2">Actions</h2>
            <button className="w-full bg-primary text-white px-4 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-sm">
              Reset Password
            </button>
            {user.status === "active" ? (
              <button className="w-full bg-warning/10 text-warning px-4 py-3 rounded-xl font-bold hover:bg-warning/20 transition-colors border border-warning/20">
                Suspend User account
              </button>
            ) : (
              <button className="w-full bg-success/10 text-success px-4 py-3 rounded-xl font-bold hover:bg-success/20 transition-colors border border-success/20">
                Activate User
              </button>
            )}
            <button className="w-full bg-error/10 text-error px-4 py-3 rounded-xl font-bold hover:bg-error/20 transition-colors border border-error/20">
              Delete User Completely
            </button>
          </div>
        </div>

        {/* Recent Activity / Order History Placeholder */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#f0f4f0] dark:border-[#2a3a2c]">
              <h2 className="text-xl font-bold text-[#111812] dark:text-white">Recent Activity Log</h2>
            </div>
            {/* Dummy Activity Feed */}
            <div className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="mt-1 flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${i % 2 === 0 ? "bg-primary" : "bg-info"}`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#111812] dark:text-white font-medium">
                      {i === 1 ? "Logged in successfully" :
                        i === 2 ? "Placed order #1234" :
                          i === 3 ? "Updated profile information" :
                            i === 4 ? "Viewed product details" : "Changed password"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(Date.now() - i * 3600000 * 5).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
