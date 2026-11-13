"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import countriesTopology from "world-atlas/countries-110m.json";
import {
  footprintByNumericId,
  type FootprintCountry,
  type FootprintRegionId,
} from "@/data/rsiGeographicExperience";
import { CountryTooltip } from "@/components/at-a-glance/CountryTooltip";
import { cn } from "@/lib/cn";

type WorldFootprintMapProps = {
  region: FootprintRegionId;
  /** 0–1 progressive highlight of documented experience countries */
  revealProgress: number;
  interactive?: boolean;
  className?: string;
};

type CountryFeature = Feature<Geometry, { name?: string; id?: string | number }>;

function normalizeId(id: string | number | undefined) {
  if (id === undefined || id === null) return "";
  return String(Number(id));
}

export function WorldFootprintMap({
  region,
  revealProgress,
  interactive = true,
  className,
}: WorldFootprintMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 900, height: 460 });
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ name: "", x: 0, y: 0, visible: false });
  const [focusIso, setFocusIso] = useState<string | null>(null);

  /** Antarctica (ISO 010) is cropped out of this editorial footprint view. */
  const ANTARCTICA_ID = "10";

  const world = useMemo(() => {
    const topology = countriesTopology as unknown as Topology<{
      countries: GeometryCollection;
    }>;
    const collection = feature(
      topology,
      topology.objects.countries,
    ) as FeatureCollection<Geometry, { name?: string }>;
    return (collection.features as CountryFeature[]).filter(
      (feat) => normalizeId(feat.id as string | number | undefined) !== ANTARCTICA_ID,
    );
  }, []);

  const experienceFeatures = useMemo(() => {
    return world
      .map((feat) => {
        const id = normalizeId(feat.id as string | number | undefined);
        const meta = footprintByNumericId.get(id);
        return meta ? { feature: feat, meta } : null;
      })
      .filter(Boolean) as { feature: CountryFeature; meta: FootprintCountry }[];
  }, [world]);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const sync = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0) {
        setSize({
          width: Math.round(rect.width),
          // Equirectangular world aspect ~2:1 — keep the map flat and wide.
          height: Math.round(Math.max(280, rect.width * 0.48)),
        });
      }
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const path = useMemo(() => {
    const land: FeatureCollection = { type: "FeatureCollection", features: world };
    const projection = geoEquirectangular().fitExtent(
      [
        [0, 0],
        [size.width, size.height],
      ],
      land,
    );
    return geoPath(projection);
  }, [size.height, size.width, world]);

  const revealCount = Math.round(
    Math.min(1, Math.max(0, revealProgress)) * experienceFeatures.length,
  );

  const revealedIds = useMemo(() => {
    return new Set(
      experienceFeatures.slice(0, revealCount).map(({ meta }) => normalizeId(meta.isoNumeric)),
    );
  }, [experienceFeatures, revealCount]);

  function isInActiveRegion(meta: FootprintCountry | undefined) {
    if (!meta) return false;
    if (region === "all") return true;
    return meta.region === region;
  }

  function countryFill(feat: CountryFeature) {
    const id = normalizeId(feat.id as string | number | undefined);
    const meta = footprintByNumericId.get(id);
    const revealed = revealedIds.has(id);
    const inRegion = isInActiveRegion(meta);
    const focused = focusIso === id;

    if (!meta || !revealed) return "#2a2a2a";
    if (!inRegion) return "#3a3a3a";
    if (focused) return "#f0243f";
    return "#d71932";
  }

  function countryOpacity(feat: CountryFeature) {
    const id = normalizeId(feat.id as string | number | undefined);
    const meta = footprintByNumericId.get(id);
    const revealed = revealedIds.has(id);
    if (!meta || !revealed) return 1;
    if (region !== "all" && !isInActiveRegion(meta)) return 0.28;
    return 1;
  }

  function showTooltip(meta: FootprintCountry, event: React.PointerEvent | React.FocusEvent) {
    if (!interactive || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const clientX = "clientX" in event ? event.clientX : rect.left + rect.width / 2;
    const clientY = "clientY" in event ? event.clientY : rect.top + rect.height / 2;
    setFocusIso(normalizeId(meta.isoNumeric));
    setTooltip({
      name: meta.name,
      x: clientX - rect.left,
      y: clientY - rect.top,
      visible: true,
    });
  }

  function hideTooltip() {
    setFocusIso(null);
    setTooltip((current) => ({ ...current, visible: false }));
  }

  return (
    <div ref={wrapRef} className={cn("relative h-full w-full", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.width} ${size.height}`}
        className="h-full w-full"
        role="img"
        aria-label="World map of RSI geographical project experience"
      >
        <g>
          {world.map((feat, featIndex) => {
            const d = path(feat) ?? undefined;
            if (!d) return null;
            const id = normalizeId(feat.id as string | number | undefined);
            const meta = footprintByNumericId.get(id);
            const interactiveCountry = Boolean(meta && revealedIds.has(id) && isInActiveRegion(meta));
            return (
              <path
                key={id || feat.properties?.name || `country-${featIndex}`}
                d={d}
                fill={countryFill(feat)}
                fillOpacity={countryOpacity(feat)}
                stroke="none"
                tabIndex={interactive && interactiveCountry ? 0 : undefined}
                aria-label={
                  interactiveCountry && meta
                    ? `${meta.name}, RSI project experience`
                    : undefined
                }
                className={cn(
                  "transition-[fill,fill-opacity] duration-300 outline-none",
                  interactiveCountry && "cursor-pointer hover:fill-[#f0243f] focus-visible:fill-[#f0243f]",
                )}
                onPointerEnter={(event) => {
                  if (meta && revealedIds.has(id) && isInActiveRegion(meta)) showTooltip(meta, event);
                }}
                onPointerMove={(event) => {
                  if (meta && revealedIds.has(id) && isInActiveRegion(meta)) showTooltip(meta, event);
                }}
                onPointerLeave={hideTooltip}
                onFocus={(event) => {
                  if (meta && revealedIds.has(id) && isInActiveRegion(meta)) showTooltip(meta, event);
                }}
                onBlur={hideTooltip}
                onClick={() => {
                  if (!(meta && revealedIds.has(id) && isInActiveRegion(meta)) || !wrapRef.current) {
                    return;
                  }
                  const centroid = path.centroid(feat);
                  const rect = wrapRef.current.getBoundingClientRect();
                  setFocusIso(id);
                  setTooltip({
                    name: meta.name,
                    x: (centroid[0] / size.width) * rect.width,
                    y: (centroid[1] / size.height) * rect.height,
                    visible: true,
                  });
                }}
              />
            );
          })}
        </g>
        {/* Symbolic region connectors — decorative only */}
        {revealProgress > 0.72 && region === "all" ? (
          <g opacity={0.22} stroke="#d71932" strokeWidth={0.8} fill="none">
            {experienceFeatures.slice(0, 4).map(({ feature: feat }, i, arr) => {
              if (i === arr.length - 1) return null;
              const a = path.centroid(feat);
              const b = path.centroid(arr[i + 1].feature);
              if (!a || !b || Number.isNaN(a[0]) || Number.isNaN(b[0])) return null;
              return (
                <path
                  key={`link-${i}`}
                  d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`}
                  strokeDasharray="3 5"
                />
              );
            })}
          </g>
        ) : null}
      </svg>
      <CountryTooltip {...tooltip} />
    </div>
  );
}
