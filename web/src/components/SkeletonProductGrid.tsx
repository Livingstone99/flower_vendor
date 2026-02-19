export default function SkeletonProductGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-white dark:bg-[#1d2d1e] rounded-2xl overflow-hidden border border-[#f0f4f0] dark:border-[#2a3a2c]">
                        <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-700" />
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                            </div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
