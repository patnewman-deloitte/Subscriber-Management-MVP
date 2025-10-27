"use client";

import { useEffect, useMemo, useState } from "react";
import { opportunities } from "@/lib/sample-data";
import { useSearchParams } from "next/navigation";
import { decodeContextFromSearch } from "@/lib/urlState";
import { runContextStub } from "@/lib/llm-stub";
import { loadRecharts } from "@/components/lazy/RechartsClient";
import { isBrowser } from "@/lib/is-browser";

export const OpportunityChart = () => {
  const searchParams = useSearchParams();
  const context = useMemo(() => decodeContextFromSearch(searchParams), [searchParams]);
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
  const BarChart = chartLib?.BarChart;
  const XAxis = chartLib?.XAxis;
  const YAxis = chartLib?.YAxis;
  const CartesianGrid = chartLib?.CartesianGrid;
  const Tooltip = chartLib?.Tooltip;
  const Bar = chartLib?.Bar;

  const data = useMemo(() => {
    if (!context) {
      return opportunities.slice(0, 6).map((opp) => ({ name: opp.zone, value: opp.value }));
    }
    const stub = runContextStub(context);
    return stub.rankedOpportunityIds
      .map((id) => opportunities.find((opp) => opp.id === id))
      .filter(Boolean)
      .map((opp) => ({ name: opp!.zone, value: opp!.value }));
  }, [context]);

  if (!ResponsiveContainer || !BarChart || !XAxis || !YAxis || !CartesianGrid || !Tooltip || !Bar) {
    return <div className="h-64 w-full animate-pulse rounded-lg bg-slate-100" />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5f5" />
          <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "rgba(26,108,74,0.1)" }} />
          <Bar dataKey="value" fill="#1a6c4a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
