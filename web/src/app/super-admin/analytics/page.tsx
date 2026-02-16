"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AnalyticsData } from "@/lib/dummy-super-admin-data";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30d");

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = (session as any)?.role;
      if (userRole !== "super_admin") {
        router.push("/dashboard");
      } else {
        loadData();
      }
    } else if (status === "unauthenticated") {
      router.push("/checkout");
    }
  }, [status, session, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { getAnalyticsData } = await import("@/lib/dummy-super-admin-data");
      const analyticsData = await getAnalyticsData();
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // Generate SVG Path for Line Chart (Revenue)
  const getLineChartPath = (dataPoints: { value: number }[], width: number, height: number) => {
    if (!dataPoints.length) return "";
    const max = Math.max(...dataPoints.map((d) => d.value)) * 1.1; // 10% buffering
    const stepX = width / (dataPoints.length - 1);

    const points = dataPoints.map((point, i) => {
      const x = i * stepX;
      const y = height - (point.value / max) * height;
      return `${x},${y}`;
    });

    // Create curved line using Bezier
    let path = `M${points[0]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i].split(",").map(Number);
      const [x1, y1] = points[i + 1].split(",").map(Number);
      const cp1x = x0 + (x1 - x0) / 2;
      const cp1y = y0;
      const cp2x = x0 + (x1 - x0) / 2;
      const cp2y = y1;
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
    }
    return path;
    // Area fill
    // return `${path} L${width},${height} L0,${height} Z`;
  };

  const getAreaChartPath = (dataPoints: { value: number }[], width: number, height: number) => {
    const linePath = getLineChartPath(dataPoints, width, height);
    return `${linePath} L${width},${height} L0,${height} Z`;
  }

  // Generate SVG for Pie/Donut Chart
  const getDonutSegments = (dataPoints: { name: string; value: number }[]) => {
    const total = dataPoints.reduce((acc, curr) => acc + curr.value, 0);
    let startAngle = 0;

    return dataPoints.map((point, index) => {
      const percentage = point.value / total;
      const angle = percentage * 360;
      const endAngle = startAngle + angle;

      // Calculate path (simplified for demo - accurate arcs require trig)
      // Representing as stroke-dasharray on circles for easier SVG donuts
      const radius = 16;
      const circumference = 2 * Math.PI * radius;
      const strokeDasharray = `${percentage * circumference} ${circumference}`;
      const rotate = `rotate(${startAngle - 90} 20 20)`; // -90 to start at top

      const segment = {
        ...point,
        percentage,
        strokeDasharray,
        rotate,
        color: index === 0 ? "text-success" : index === 1 ? "text-info" : index === 2 ? "text-warning" : "text-error"
      };

      startAngle = endAngle;
      return segment;
    });
  };

  const handleExport = () => {
    if (!data) return;

    // Create CSV content
    const header = "Date,Revenue,User Growth\n";
    const rows = data.revenue_history.map((item, index) => {
      const userGrowth = data.user_growth[index] ? data.user_growth[index].value : "";
      return `${item.date},${item.value},${userGrowth}`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURI(header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || status === "loading") {
    return (
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/super-admin"
            className="text-primary hover:text-primary-dark font-semibold text-sm mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-[#111812] dark:text-white">Analytics</h1>
        </div>
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white dark:bg-[#1d2d1e] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* SVG Line Chart (Revenue) */}
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-6">Revenue Growth</h2>
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line key={i} x1="0" y1={i * 50} x2="500" y2={i * 50} stroke="currentColor" strokeOpacity="0.1" className="text-gray-400" />
              ))}

              {/* Area Fill */}
              <path
                d={getAreaChartPath(data.revenue_history, 500, 200)}
                className="text-primary fill-current opacity-10"
              />

              {/* Line */}
              <path
                d={getLineChartPath(data.revenue_history, 500, 200)}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-primary drop-shadow-md"
              />

              {/* Data Points */}
              {data.revenue_history.map((point, i) => {
                const max = Math.max(...data.revenue_history.map(d => d.value)) * 1.1;
                const x = i * (500 / (data.revenue_history.length - 1));
                const y = 200 - (point.value / max) * 200;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    className="text-primary fill-white dark:fill-[#1d2d1e] stroke-current hover:r-6 transition-all duration-300 cursor-pointer"
                    strokeWidth="2"
                  >
                    <title>${point.value.toLocaleString()} on {point.date}</title>
                  </circle>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium">
            <span>{data.revenue_history[0].date}</span>
            <span>{data.revenue_history[Math.floor(data.revenue_history.length / 2)].date}</span>
            <span>{data.revenue_history[data.revenue_history.length - 1].date}</span>
          </div>
        </div>

        {/* SVG Donut Chart (Order Distribution) */}
        <div className="bg-white dark:bg-[#1d2d1e] border border-[#f0f4f0] dark:border-[#2a3a2c] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-[#111812] dark:text-white mb-6 w-full text-left">Order Distribution</h2>
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
              {/* Background Circle */}
              <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />

              {/* Segments */}
              {getDonutSegments(data.order_distribution).map((seg, i) => (
                <circle
                  key={i}
                  cx="20"
                  cy="20"
                  r="16"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset="0"
                  transform={seg.rotate}
                  className={`${seg.color} transition-all duration-500 ease-out`}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-[#111812] dark:text-white">
                {data.order_distribution.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-xs text-gray-500 uppercase font-semibold">Orders</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-6 w-full">
            {data.order_distribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-success" : index === 1 ? "bg-info" : index === 2 ? "bg-warning" : "bg-error"}`}></div>
                <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                <span className="font-bold text-[#111812] dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics / Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20">
          <h3 className="text-primary font-bold text-lg mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-[#111812] dark:text-white">
            ${(data.revenue_history.reduce((a, b) => a + b.value, 0)).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+12.5% vs last month</p>
        </div>
        <div className="bg-gradient-to-br from-info/10 to-transparent p-6 rounded-2xl border border-info/20">
          <h3 className="text-info font-bold text-lg mb-2">User Growth</h3>
          <p className="text-3xl font-bold text-[#111812] dark:text-white">
            +{data.user_growth[data.user_growth.length - 1].value - data.user_growth[0].value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active users this period</p>
        </div>
        <div className="bg-gradient-to-br from-warning/10 to-transparent p-6 rounded-2xl border border-warning/20">
          <h3 className="text-warning font-bold text-lg mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-[#111812] dark:text-white">
            3.2%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sessions to Orders</p>
        </div>
      </div>
    </main>
  );
}
