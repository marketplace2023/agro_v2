"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabDef {
  id: string;
  label: string;
}

interface ProductTabsProps {
  tabs: TabDef[];
  panels: Record<string, React.ReactNode>;
}

export function ProductTabs({ tabs, panels }: ProductTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div>
      {/* Tab navigation */}
      <nav className="flex border-b border-[var(--color-border-subtle)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors shrink-0",
              active === tab.id
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab panel */}
      <div className="py-6">{panels[active]}</div>
    </div>
  );
}
