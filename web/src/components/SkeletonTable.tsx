export default function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#f0f4f0] dark:bg-[#102212]">
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-6 py-3 text-left">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4f0] dark:divide-[#2a3a2c]">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
