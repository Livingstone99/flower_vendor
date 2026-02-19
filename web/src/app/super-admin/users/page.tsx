"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = (session as any)?.role;
      if (userRole !== "super_admin") {
        router.push("/dashboard");
      } else {
        loadUsers();
      }
    } else if (status === "unauthenticated") {
      router.push("/checkout");
    }
  }, [status, session, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { getAllUsers } = await import("@/lib/dummy-super-admin-data");
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = selectedRole === "all"
    ? users
    : users.filter((user) => user.role === selectedRole);

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <Link
        href="/super-admin"
        className="text-primary hover:text-primary-dark font-semibold text-sm mb-4 inline-block"
      >
        ← Back to Super Admin Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-2">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage all users in the system</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Filter and Actions */}
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          {["all", "customer", "admin", "super_admin"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                selectedRole === role
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] text-[#111812] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a3a2c]"
              }`}
            >
              {role === "all" ? "All Users" : role.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0f4f0] dark:bg-[#102212]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#102212] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#111812] dark:text-white">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          user.role === "super_admin"
                            ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                            : user.role === "admin"
                            ? "bg-primary/20 text-primary"
                            : "bg-gray-100 dark:bg-[#2a3a2c] text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/super-admin/users/${user.id}`}
                        className="text-primary hover:text-primary-dark font-semibold"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

