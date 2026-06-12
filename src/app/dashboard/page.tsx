import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

const ROLE_HOME: Record<string, string> = {
  comprador:             "/dashboard/comprador",
  comprador_corporativo: "/dashboard/comprador-corporativo",
  vendedor:              "/dashboard/vendedor",
  fabricante:            "/dashboard/fabricante",
  distribuidor:          "/dashboard/distribuidor",
  asesor:                "/dashboard/asesor",
  logistica:             "/dashboard/logistica",
  regulatorio:           "/dashboard/regulatorio",
  finanzas:              "/dashboard/finanzas",
  soporte:               "/dashboard/soporte",
  marketing:             "/dashboard/marketing",
  almacen:               "/dashboard/almacen",
  representante:         "/dashboard/representante",
  "experto-regional":    "/dashboard/experto-regional",
  credito:               "/dashboard/credito",
  admin:                 "/admin",
};

export default async function DashboardIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "comprador";
  redirect(ROLE_HOME[role] ?? "/dashboard/comprador");
}
