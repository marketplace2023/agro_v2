import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

// GET /api/pdf/[type]?orderId=ORD-XXX
// type: invoice | remision | certificate
export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { type } = await params;
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) return NextResponse.json({ error: "orderId requerido" }, { status: 400 });

  const validTypes = ["invoice", "remision", "certificate"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Tipo de documento inválido" }, { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToBuffer } = await import("@react-pdf/renderer");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = (await import("react")).default;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pdfElement: any;

    if (type === "invoice") {
      const { InvoicePDF } = await import("@/lib/pdf/invoice-template");
      const invoiceData = {
        num: `FAC-${orderId.replace("ORD-", "")}`,
        fecha: new Date().toLocaleDateString("es-CO"),
        fechaVence: new Date(Date.now() + 30 * 86400000).toLocaleDateString("es-CO"),
        vendedor: {
          nombre: "DistAgroMax SAS",
          nit: "900.123.456-7",
          direccion: "Cra 13 # 26-45, Bogotá D.C., Colombia",
          email: "ventas@distagromax.com.co",
          telefono: "+57 601 123 4567",
        },
        comprador: {
          nombre: "Agroproductos SA",
          nit: "800.987.654-3",
          direccion: "Km 5 Vía Principal, Funza, Cundinamarca",
          email: "compras@agroproductos.com.co",
        },
        items: [
          { description: "Urea Granulada 46% (sacos 50kg)", quantity: 20, unit: "saco", unitPrice: 34, total: 680 },
          { description: "Soporte técnico — visita en campo", quantity: 1, unit: "visita", unitPrice: 170, total: 170 },
        ],
        subtotal: 850,
        descuento: 0,
        iva: 161.5,
        total: 1011.5,
        moneda: "USD",
        notas: `Orden de referencia: ${orderId}.`,
      };
      pdfElement = React.createElement(InvoicePDF, { data: invoiceData });
    } else if (type === "remision") {
      const { RemisionPDF } = await import("@/lib/pdf/remision-template");
      const remisionData = {
        num: `REM-${orderId.replace("ORD-", "")}`,
        fecha: new Date().toLocaleDateString("es-CO"),
        ordenRef: orderId,
        origen: { nombre: "DistAgroMax — Bodega Bogotá", direccion: "Cra 13 # 26-45, Bogotá", responsable: "Carlos Mendoza" },
        destino: { nombre: "Agroproductos SA", direccion: "Km 5, Funza, Cundinamarca", contacto: "María García +57 300 000 0000" },
        transportista: "Transportes Andinos SAS",
        guia: `TRK-${Date.now().toString().slice(-6)}`,
        items: [
          { description: "Urea Granulada 46%", quantity: 20, unit: "sacos 50kg", lote: "LOT-2026-0041", fechaVence: "2027-06-01" },
        ],
        notas: "Almacenar en lugar seco. No apilar más de 10 sacos.",
      };
      pdfElement = React.createElement(RemisionPDF, { data: remisionData });
    } else {
      // certificate
      const { Document, Page, Text, View, StyleSheet } = await import("@react-pdf/renderer");
      const s = StyleSheet.create({
        page: { fontFamily: "Helvetica", fontSize: 10, padding: 60, alignItems: "center" },
        title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#2B5F2B", textAlign: "center", marginTop: 40 },
        subtitle: { fontSize: 12, color: "#3f484c", textAlign: "center", marginTop: 8 },
        body: { fontSize: 11, textAlign: "center", marginTop: 32, lineHeight: 1.5 },
        border: { borderWidth: 3, borderColor: "#005c72", position: "absolute", top: 20, left: 20, right: 20, bottom: 20 },
        footer: { position: "absolute", bottom: 40, textAlign: "center", fontSize: 9, color: "#3f484c" },
      });
      pdfElement = React.createElement(
        Document, { title: `Certificado de Calidad — ${orderId}` },
        React.createElement(
          Page, { size: "A4", style: s.page },
          React.createElement(View, { style: s.border }),
          React.createElement(Text, { style: s.title }, "CERTIFICADO DE CALIDAD"),
          React.createElement(Text, { style: s.subtitle }, "AgroMarket — Marketplace Agro Latinoamérica"),
          React.createElement(Text, { style: s.body },
            `Por medio del presente certificado, se hace constar que los productos\ncorrespondientes a la orden ${orderId}\ncumplen con los estándares de calidad establecidos\nsegún resolución ICA y normas ICONTEC vigentes.`
          ),
          React.createElement(Text, { style: s.footer },
            `Emitido el ${new Date().toLocaleDateString("es-CO")} · AgroMarket`
          )
        )
      );
    }

    const pdfBuffer = await renderToBuffer(pdfElement);

    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${type}-${orderId}.pdf"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error generando PDF";
    console.error("PDF generation error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
