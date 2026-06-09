"use client";

import { SalesLineChart, OrdersBarChart, CategoryPieChart, RevenueLineChart } from "./charts";

export function AdminCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h3 className="font-semibold text-sm mb-4">Ingresos — 6 meses</h3>
        <RevenueLineChart />
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h3 className="font-semibold text-sm mb-4">Órdenes por estado — 6 meses</h3>
        <OrdersBarChart />
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h3 className="font-semibold text-sm mb-4">Ventas — últimos 30 días</h3>
        <SalesLineChart />
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
        <h3 className="font-semibold text-sm mb-4">Distribución por categoría</h3>
        <CategoryPieChart />
      </div>
    </div>
  );
}
