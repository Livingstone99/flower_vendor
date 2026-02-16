"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SystemSettings, getSystemSettings, updateSystemSettings } from "@/lib/dummy-super-admin-data";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (status === "authenticated") {
            const userRole = (session as any)?.role;
            if (userRole !== "super_admin") {
                router.push("/dashboard");
            } else {
                loadSettings();
            }
        } else if (status === "unauthenticated") {
            router.push("/checkout");
        }
    }, [status, session, router]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await getSystemSettings();
            setSettings(data);
        } catch (err: any) {
            setMessage({ type: "error", text: "Failed to load settings" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        try {
            setSaving(true);
            setMessage(null);
            await updateSystemSettings(settings);
            setMessage({ type: "success", text: "Settings saved successfully" });
        } catch (err: any) {
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: keyof SystemSettings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
    };

    if (loading || status === "loading") {
        return (
            <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
                <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
            </main>
        );
    }

    if (!settings) return null;

    return (
        <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
            <Link
                href="/super-admin"
                className="text-primary hover:text-primary-dark font-semibold text-sm mb-4 inline-block"
            >
                ← Back to Super Admin Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#111812] dark:text-white mb-2">System Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Configure global application settings</p>
            </div>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-xl border ${message.type === "success"
                            ? "bg-success/20 border-success/30 text-success-dark"
                            : "bg-error/20 border-error/30 text-error-dark"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Sidebar (Dummy) */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl overflow-hidden">
                        <nav className="flex flex-col">
                            <button className="text-left px-6 py-4 font-semibold text-primary bg-primary/5 border-l-4 border-primary">
                                General Settings
                            </button>
                            <button className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-l-4 border-transparent">
                                Notifications
                            </button>
                            <button className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-l-4 border-transparent">
                                Security
                            </button>
                            <button className="text-left px-6 py-4 font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-l-4 border-transparent">
                                Integrations
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-6">General Configuration</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#111812] dark:text-white mb-2">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => handleChange("site_name", e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-[#f0f4f0] dark:border-[#2a3a2c] bg-gray-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#111812] dark:text-white mb-2">
                                    Default Currency
                                </label>
                                <select
                                    value={settings.default_currency}
                                    onChange={(e) => handleChange("default_currency", e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-[#f0f4f0] dark:border-[#2a3a2c] bg-gray-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
                                <div>
                                    <h3 className="font-semibold text-[#111812] dark:text-white">Maintenance Mode</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Prevent users from accessing the store during updates.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChange("maintenance_mode", !settings.maintenance_mode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${settings.maintenance_mode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
                                <div>
                                    <h3 className="font-semibold text-[#111812] dark:text-white">Email Notifications</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Receive system alerts via email.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChange("email_notifications", !settings.email_notifications)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${settings.email_notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
                                <div>
                                    <h3 className="font-semibold text-[#111812] dark:text-white">Auto-Confirm Orders</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Automatically confirm orders upon payment receipt.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChange("order_auto_confirmation", !settings.order_auto_confirmation)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${settings.order_auto_confirmation ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.order_auto_confirmation ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#f0f4f0] dark:border-[#2a3a2c] flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-6 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary text-white px-8 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
