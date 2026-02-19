export default function SkeletonStats({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 animate-pulse"
                >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
            ))}
        </div>
    );
}
