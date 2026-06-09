"use client";

import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ─── Ventas 30 días ──────────────────────────────────────────────────────────
const salesData = [
  { day: "01", ventas: 1200 }, { day: "03", ventas: 980 }, { day: "05", ventas: 1800 },
  { day: "07", ventas: 1400 }, { day: "09", ventas: 2200 }, { day: "11", ventas: 1900 },
  { day: "13", ventas: 2100 }, { day: "15", ventas: 2500 }, { day: "17", ventas: 1700 },
  { day: "19", ventas: 2900 }, { day: "21", ventas: 2200 }, { day: "23", ventas: 2600 },
  { day: "25", ventas: 3100 }, { day: "27", ventas: 2800 }, { day: "29", ventas: 3400 },
];

export function SalesLineChart({ data = salesData }: { data?: typeof salesData }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#005c72" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#005c72" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Ventas"]} />
        <Area type="monotone" dataKey="ventas" stroke="#005c72" strokeWidth={2} fill="url(#colorVentas)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Gasto por sede ───────────────────────────────────────────────────────────
const sedeData = [
  { sede: "Bogotá", gasto: 18400 },
  { sede: "Medellín", gasto: 12200 },
  { sede: "Cali", gasto: 9800 },
  { sede: "Barranquilla", gasto: 7600 },
  { sede: "Bucaramanga", gasto: 5200 },
];

export function SedeBarChart({ data = sedeData }: { data?: typeof sedeData }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="sede" tick={{ fontSize: 11 }} width={90} />
        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Gasto"]} />
        <Bar dataKey="gasto" fill="#2B5F2B" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Ventas por categoría (pie) ───────────────────────────────────────────────
const categoryData = [
  { name: "Fertilizantes", value: 38 },
  { name: "Herbicidas", value: 22 },
  { name: "Fungicidas", value: 18 },
  { name: "Biológicos", value: 12 },
  { name: "Insecticidas", value: 10 },
];
const COLORS = ["#005c72", "#2B5F2B", "#bc000a", "#484d94", "#FF9C23"];

export function CategoryPieChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {categoryData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${Number(v)}%`, ""]} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Órdenes por estado ────────────────────────────────────────────────────
const orderStatusData = [
  { mes: "Ene", confirmadas: 42, despachadas: 38, entregadas: 35 },
  { mes: "Feb", confirmadas: 55, despachadas: 50, entregadas: 48 },
  { mes: "Mar", confirmadas: 48, despachadas: 45, entregadas: 43 },
  { mes: "Abr", confirmadas: 61, despachadas: 57, entregadas: 54 },
  { mes: "May", confirmadas: 73, despachadas: 68, entregadas: 65 },
  { mes: "Jun", confirmadas: 82, despachadas: 76, entregadas: 71 },
];

export function OrdersBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={orderStatusData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
        <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend iconType="circle" iconSize={8} />
        <Bar dataKey="confirmadas" fill="#005c72" radius={[2, 2, 0, 0]} name="Confirmadas" />
        <Bar dataKey="despachadas" fill="#2B5F2B" radius={[2, 2, 0, 0]} name="Despachadas" />
        <Bar dataKey="entregadas" fill="#FF9C23" radius={[2, 2, 0, 0]} name="Entregadas" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Ingresos globales ────────────────────────────────────────────────────────
const revenueData = [
  { mes: "Ene", ingresos: 48000 }, { mes: "Feb", ingresos: 62000 },
  { mes: "Mar", ingresos: 55000 }, { mes: "Abr", ingresos: 71000 },
  { mes: "May", ingresos: 84000 }, { mes: "Jun", ingresos: 96000 },
];

export function RevenueLineChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
        <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Ingresos"]} />
        <Line type="monotone" dataKey="ingresos" stroke="#bc000a" strokeWidth={2} dot={{ r: 4, fill: "#bc000a" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
