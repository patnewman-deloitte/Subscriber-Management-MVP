"use client";

import { memo, useEffect, useMemo, useState } from "react";
import geoData from "@/lib/geo/pr-zones.json";
import { loadSimpleMaps } from "@/components/lazy/SimpleMapsClient";
import { isBrowser } from "@/lib/is-browser";

export interface ZoneHeatmapProps {
  values: { zone: string; intensity: number }[];
}

const intensityToColor = (intensity: number) => {
  const clamped = Math.max(0, Math.min(intensity, 1));
  const lightness = 90 - clamped * 40;
  const saturation = 45 + clamped * 25;
  return `hsl(158 ${saturation}% ${lightness}%)`;
};

const ZoneHeatmapComponent = ({ values }: ZoneHeatmapProps) => {
  const [maps, setMaps] = useState<typeof import("react-simple-maps") | null>(null);

  useEffect(() => {
    if (!isBrowser) return;
    let mounted = true;
    loadSimpleMaps().then((mod) => {
      if (mounted) {
        setMaps(mod);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const ComposableMap = maps?.ComposableMap;
  const Geographies = maps?.Geographies;
  const Geography = maps?.Geography;

  const lookup = useMemo(() => new Map(values.map((entry) => [entry.zone, entry.intensity])), [values]);

  if (!ComposableMap || !Geographies || !Geography) {
    return <div className="h-64 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-50" />;
  }

  return (
    <div className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <ComposableMap projectionConfig={{ scale: 7000 }} width={420} height={260}>
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const zone = geo.properties.name as string;
              const intensity = lookup.get(zone) ?? 0.2;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={intensityToColor(intensity)}
                  stroke="#94a3b8"
                  style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                  tabIndex={0}
                >
                  <title>
                    {zone}: {(intensity * 100).toFixed(0)}% intensity
                  </title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export const ZoneHeatmap = memo(ZoneHeatmapComponent);
