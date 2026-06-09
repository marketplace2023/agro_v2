import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: string; up: boolean };
  color?: "primary" | "green" | "red" | "orange" | "purple";
}

const colorMap = {
  primary: "bg-[var(--color-primary)] text-white",
  green:   "bg-[var(--color-agri-green)] text-white",
  red:     "bg-[var(--color-secondary)] text-white",
  orange:  "bg-[var(--color-rating-stars)] text-white",
  purple:  "bg-[var(--color-tertiary)] text-white",
};

export function StatsCard({ title, value, subtitle, icon, trend, color = "primary" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 flex gap-4 items-start">
      {icon && (
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color]}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--color-on-surface-variant)] font-medium uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-[var(--color-on-surface)] font-[var(--font-headline)] mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trend.up ? "text-[var(--color-agri-green)]" : "text-[var(--color-secondary)]"}`}>
            {trend.up ? "▲" : "▼"} {trend.value} vs mes anterior
          </p>
        )}
      </div>
    </div>
  );
}
