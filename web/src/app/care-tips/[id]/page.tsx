"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { careTips } from "../data";

interface CareTipDetailProps {
    params: Promise<{
        id: string;
    }>;
}

export default function CareTipDetailPage({ params }: CareTipDetailProps) {
    const { id } = use(params);
    const tip = careTips.find((t) => t.id === Number(id));

    if (!tip) {
        notFound();
    }

    return (
        <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
                <Link
                    href="/"
                    className="text-[#618965] dark:text-primary/70 text-sm font-medium hover:underline"
                >
                    Home
                </Link>
                <span className="text-[#618965] dark:text-primary/70 text-sm">/</span>
                <Link
                    href="/care-tips"
                    className="text-[#618965] dark:text-primary/70 text-sm font-medium hover:underline"
                >
                    Care Tips
                </Link>
                <span className="text-[#618965] dark:text-primary/70 text-sm">/</span>
                <span className="text-[#111812] dark:text-white text-sm font-semibold truncate max-w-[200px]">
                    {tip.title}
                </span>
            </div>

            <article className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                        <span className="font-bold uppercase tracking-widest text-primary">
                            {tip.category}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-gray-500 dark:text-gray-400">
                            {tip.readTime}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#111812] dark:text-white mb-6 leading-tight">
                        {tip.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        {tip.description}
                    </p>
                </div>

                {/* Featured Image */}
                <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-xl">
                    <Image
                        src={tip.imageUrl}
                        alt={tip.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {tip.sections.map((section, index) => (
                        <div key={index} className="mb-10">
                            <h2 className="text-2xl font-bold text-[#111812] dark:text-white mb-4">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-8">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <Link
                        href="/care-tips"
                        className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                    >
                        <span className="material-symbols-outlined rotate-180">
                            arrow_forward
                        </span>
                        Back to All Tips
                    </Link>
                </div>
            </article>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 border border-primary/20">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#111812] dark:text-white mb-3">
                        Found this helpful?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Join our community to get more plant care guides like this delivered
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
