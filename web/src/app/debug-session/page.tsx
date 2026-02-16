"use client";

import { useSession } from "next-auth/react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-8">Session Debug</h1>
      
      <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-4">Session Status</h2>
        <pre className="bg-gray-100 dark:bg-[#102212] p-4 rounded-xl overflow-auto text-sm">
          {JSON.stringify(
            {
              status,
              session: session
                ? {
                    user: session.user,
                    role: (session as any).role,
                    accessToken: (session as any).accessToken
                      ? "***" + (session as any).accessToken.slice(-10)
                      : "none",
                  }
                : null,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="mt-6">
        <a
          href="/super-admin"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
        >
          Try Super Admin Route
        </a>
      </div>
    </main>
  );
}

