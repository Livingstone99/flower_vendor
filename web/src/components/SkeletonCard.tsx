export default function SkeletonCard() {
    return (
        <div className="min-w-[280px] flex-shrink-0 animate-pulse">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700" />
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
        </div>
    );
}
