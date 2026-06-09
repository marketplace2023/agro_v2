import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { renderToBuffer } from "@react-pdf/renderer";
import { CorporateReportDocument, CorporateReportData } from "@/lib/pdf/corporate-report";
import { createElement } from "react";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const allowed = ["comprador_corporativo", "finanzas", "admin"];
  if (!allowed.includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const companyId = searchParams.get("companyId") ?? "demo";
  const period = searchParams.get("period") ?? "2025-01";

  // In production, query prisma for real data filtered by companyId + period.
  // Here we return a realistic mock so the PDF route is immediately testable.
  const data: CorporateReportData = {
    companyName: "AgroInversiones S.A.S",
    period,
    generatedAt: new Date().toLocaleString("es-CO"),
    totals: { spend: 458320, orders: 34, vendors: 8, products: 62 },
    bySede: [
      { name: "Finca La Esperanza — Cundinamarca", spend: 185400, orders: 14, pct: 40.5 },
      { name: "Finca El Progreso — Meta", spend: 142000, orders: 11, pct: 31.0 },
      { name: "Finca Guadalupe — Tolima", spend: 96200, orders: 7, pct: 21.0 },
      { name: "Almacén Central Bogotá", spend: 34720, orders: 2, pct: 7.6 },
    ],
    byCultivo: [
      { name: "Arroz", spend: 178400, orders: 13 },
      { name: "Maíz", spend: 134200, orders: 10 },
      { name: "Palma de aceite", spend: 89500, orders: 7 },
      { name: "Café", spend: 56220, orders: 4 },
    ],
    byVendor: [
      { name: "DistAgroMax", spend: 195000, orders: 14, avgDelay: 1 },
      { name: "BioSolutions", spend: 98400, orders: 9, avgDelay: 0 },
      { name: "NutriAgro", spend: 87200, orders: 6, avgDelay: 4 },
      { name: "QuimicaAgri", spend: 77720, orders: 5, avgDelay: 2 },
    ],
    byCC: [
      { name: "CC-001 Producción Norte", budget: 200000, spent: 185400, pct: 92.7 },
      { name: "CC-002 Producción Sur", budget: 180000, spent: 142000, pct: 78.9 },
      { name: "CC-003 Infraestructura", budget: 120000, spent: 96200, pct: 80.2 },
      { name: "CC-004 Operaciones", budget: 50000, spent: 34720, pct: 69.4 },
    ],
  };

  const element = createElement(CorporateReportDocument, { data });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(element as any);

  const filename = `reporte-${companyId}-${period}.pdf`;
  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
