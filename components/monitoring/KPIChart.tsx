"use client";

import { useEffect, useState } from "react";
import { kpiBundles } from "@/lib/sample-data";
import { loadRecharts } from "@/components/lazy/RechartsClient";
import { isBrowser } from "@/lib/is-browser";

export const KPIChart = () => {
  const [chartLib, setChartLib] = useState<typeof import("recharts") | null>(null);

  useEffect(() => {
    if (!isBrowser) return;
    let mounted = true;
    loadRecharts().then((mod) => {
      if (mounted) {
        setChartLib(mod);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const ResponsiveContainer = chartLib?.ResponsiveContainer;
  const LineChart = chartLib?.LineChart;
  const XAxis = chartLib?.XAxis;
  const YAxis = chartLib?.YAxis;
  const CartesianGrid = chartLib?.CartesianGrid;
  const Tooltip = chartLib?.Tooltip;
  const Line = chartLib?.Line;

  const series = kpiBundles[0].series;

  if (!ResponsiveContainer || !LineChart || !XAxis || !YAxis || !CartesianGrid || !Tooltip || !Line) {
    return <div className="h-72 w-full animate-pulse rounded-lg bg-slate-100" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5f5" />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ stroke: "#1a6c4a" }} />
          <Line type="monotone" dataKey="value" stroke="#1a6c4a" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
