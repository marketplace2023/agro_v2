"use client";

import { useEffect, useState } from "react";
import { MapPin, TrendingUp, Leaf } from "lucide-react";

interface RegionZone {
  name: string;
  total: number;
  alta: number;
  pendientes: number;
  crops: Record<string, number>;
}

interface RegionSummary {
  total: number;
  alta: number;
  media: number;
  baja: number;
}

export default function VistaRegionPage() {
  const [zones, setZones] = useState<RegionZone[]>([]);
  const [summary, setSummary] = useState<RegionSummary>({ total: 0, alta: 0, media: 0, baja: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experto-regional/region")
      .then((r) => r.json())
      .then((res) => {
        setZones(res.regions ?? []);
        setSummary(res.summary ?? { total: 0, alta: 0, media: 0, baja: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-headline-md font-bold">Vista de Región</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Estadísticas fitosanitarias agrupadas por zona</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Casos totales",   value: summary.total, color: "text-[var(--color-primary)]" },
          { label: "Alta prioridad",  value: summary.alta,  color: "text-red-600" },
          { label: "Media prioridad", value: summary.media, color: "text-orange-600" },
          { label: "Baja prioridad",  value: summary.baja,  color: "text-yellow-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
          <MapPin size={32} className="mx-auto mb-2 opacity-30 animate-pulse" />
          <p className="text-sm">Cargando datos regionales...</p>
        </div>
      )}

      {!loading && zones.length === 0 && (
        <div className="text-center py-16 bg-white border border-[var(--color-border-subtle)] rounded-xl text-[var(--color-on-surface-variant)]">
          <MapPin size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">Sin regiones asignadas</p>
          <p className="text-xs mt-1 max-w-xs mx-auto">
            Pide al administrador que asigne regiones a tu perfil de experto para ver los datos aquí.
          </p>
        </div>
      )}

      {!loading && zones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => {
            const topCrops = Object.entries(zone.crops)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3);

            const altaPct = zone.total > 0 ? Math.round((zone.alta / zone.total) * 100) : 0;
            const pendPct = zone.total > 0 ? Math.round((zone.pendientes / zone.total) * 100) : 0;

            return (
              <div key={zone.name} className="bg-white border border-[var(--color-border-subtle)] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[var(--color-primary)]" />
                  <h3 className="font-semibold text-sm">{zone.name}</h3>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[var(--color-surface-container-low)] rounded-lg p-2.5">
                    <p className="text-lg font-bold text-[var(--color-primary)]">{zone.total}</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)]">Casos</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2.5">
                    <p className="text-lg font-bold text-red-600">{zone.alta}</p>
                    <p className="text-[10px] text-red-400">Alta prior.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2.5">
                    <p className="text-lg font-bold text-blue-600">{zone.pendientes}</p>
                    <p className="text-[10px] text-blue-400">Pendientes</p>
                  </div>
                </div>

                {zone.total > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--color-on-surface-variant)] mb-1">
                      <span className="flex items-center gap-1"><TrendingUp size={9} /> Alta {altaPct}%</span>
                      <span className="flex items-center gap-1"><TrendingUp size={9} /> Pendientes {pendPct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden flex">
                      <div className="bg-red-500 h-full" style={{ width: `${altaPct}%` }} />
                      <div className="bg-blue-400 h-full" style={{ width: `${Math.min(pendPct, 100 - altaPct)}%` }} />
                    </div>
                  </div>
                )}

                {topCrops.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1.5 flex items-center gap-1">
                      <Leaf size={10} /> Cultivos más afectados
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {topCrops.map(([crop, count]) => (
                        <span key={crop} className="text-xs bg-[var(--color-surface-container-low)] px-2 py-0.5 rounded-full">
                          {crop} <span className="font-semibold text-[var(--color-primary)]">({count})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
