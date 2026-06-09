"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface CategoryItem {
  label: string;
  href: string;
  icon?: string;
  subcategories?: { label: string; href: string }[];
}

const CATEGORIES: CategoryItem[] = [
  {
    label: "Fertilizantes",
    href: "/categorias/fertilizantes",
    icon: "🌱",
    subcategories: [
      { label: "NPK", href: "/categorias/fertilizantes/npk" },
      { label: "Nitrogenados", href: "/categorias/fertilizantes/nitrogenados" },
      { label: "Fosfatados", href: "/categorias/fertilizantes/fosfatados" },
      { label: "Potásicos", href: "/categorias/fertilizantes/potasicos" },
      { label: "Foliares", href: "/categorias/fertilizantes/foliares" },
      { label: "Orgánicos", href: "/categorias/fertilizantes/organicos" },
    ],
  },
  {
    label: "Herbicidas",
    href: "/categorias/herbicidas",
    icon: "🌿",
    subcategories: [
      { label: "Selectivos", href: "/categorias/herbicidas/selectivos" },
      { label: "No selectivos", href: "/categorias/herbicidas/no-selectivos" },
      {
        label: "Pre-emergentes",
        href: "/categorias/herbicidas/pre-emergentes",
      },
      {
        label: "Post-emergentes",
        href: "/categorias/herbicidas/post-emergentes",
      },
    ],
  },
  {
    label: "Fungicidas",
    href: "/categorias/fungicidas",
    icon: "🍄",
    subcategories: [
      { label: "Sistémicos", href: "/categorias/fungicidas/sistemicos" },
      { label: "Preventivos", href: "/categorias/fungicidas/preventivos" },
      { label: "Curativos", href: "/categorias/fungicidas/curativos" },
    ],
  },
  {
    label: "Insecticidas",
    href: "/categorias/insecticidas",
    icon: "🐛",
    subcategories: [
      { label: "Piretroides", href: "/categorias/insecticidas/piretroides" },
      {
        label: "Organofosforados",
        href: "/categorias/insecticidas/organofosforados",
      },
      { label: "Biológicos", href: "/categorias/insecticidas/biologicos" },
    ],
  },
  {
    label: "Biológicos",
    href: "/categorias/biologicos",
    icon: "🔬",
    subcategories: [
      {
        label: "Bioestimulantes",
        href: "/categorias/biologicos/bioestimulantes",
      },
      { label: "Biocontrol", href: "/categorias/biologicos/biocontrol" },
      { label: "Inoculantes", href: "/categorias/biologicos/inoculantes" },
    ],
  },
  {
    label: "Acaricidas",
    href: "/categorias/acaricidas",
    icon: "🕷️",
  },
  {
    label: "Nematicidas",
    href: "/categorias/nematicidas",
    icon: "🪱",
  },
  {
    label: "Coadyuvantes",
    href: "/categorias/coadyuvantes",
    icon: "⚗️",
  },
  {
    label: "Semillas",
    href: "/categorias/semillas",
    icon: "🌾",
  },
  {
    label: "Equipo agrícola",
    href: "/categorias/equipos",
    icon: "🚜",
  },
];

interface CategoryNavProps {
  variant?: "horizontal" | "sidebar";
  className?: string;
}

export function CategoryNav({
  variant = "horizontal",
  className,
}: CategoryNavProps) {
  const pathname = usePathname();

  if (variant === "sidebar") {
    return (
      <nav className={cn("w-full", className)}>
        <ul className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const isActive =
              pathname === cat.href || pathname.startsWith(cat.href + "/");
            return (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded text-sm transition-colors",
                    isActive
                      ? "bg-[var(--color-primary)] text-white font-semibold"
                      : "text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {cat.icon && (
                      <span className="text-base leading-none">{cat.icon}</span>
                    )}
                    {cat.label}
                  </span>
                  {cat.subcategories && (
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  // Horizontal variant — scrollable pill bar
  return (
    <nav
      className={cn(
        "bg-[var(--color-surface-container-low)] border-b border-[var(--color-border-subtle)]",
        className,
      )}
    >
      <div className="container-max">
        <div className="flex items-center overflow-x-auto gap-0 scrollbar-none h-10">
          {CATEGORIES.map((cat) => {
            const isActive =
              pathname === cat.href || pathname.startsWith(cat.href + "/");
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 h-10 text-sm whitespace-nowrap flex-shrink-0 border-b-2 transition-colors",
                  isActive
                    ? "border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
                    : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:border-[var(--color-outline-variant)]",
                )}
              >
                {cat.icon && (
                  <span className="text-sm leading-none">{cat.icon}</span>
                )}
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
