import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

export const runtime = "nodejs";

// POST /api/email/send
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { type, to, data } = body as { type: string; to: string; data: Record<string, unknown> };

  if (!type || !to) return NextResponse.json({ error: "type y to son requeridos" }, { status: 400 });

  let html = "";
  let subject = "";

  try {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const React = (await import("react")).default;
    const templates = await import("@/lib/email/templates");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = data as any;

    switch (type) {
      case "orden_confirmada":
        html = renderToStaticMarkup(React.createElement(templates.EmailOrdenConfirmada, d));
        subject = `Orden confirmada: ${d.orderId}`;
        break;
      case "pago_recibido":
        html = renderToStaticMarkup(React.createElement(templates.EmailPagoRecibido, d));
        subject = `Pago recibido: ${d.orderId}`;
        break;
      case "orden_despachada":
        html = renderToStaticMarkup(React.createElement(templates.EmailOrdenDespachada, d));
        subject = `Tu pedido está en camino — ${d.orderId}`;
        break;
      case "orden_entregada":
        html = renderToStaticMarkup(React.createElement(templates.EmailOrdenEntregada, d));
        subject = `Pedido entregado: ${d.orderId}`;
        break;
      case "nueva_rfq":
        html = renderToStaticMarkup(React.createElement(templates.EmailNuevaRFQ, d));
        subject = `Nueva RFQ recibida: ${d.rfqId}`;
        break;
      case "aprobacion_pendiente":
        html = renderToStaticMarkup(React.createElement(templates.EmailAprobacionPendiente, d));
        subject = `Aprobación requerida: ${d.orderId}`;
        break;
      case "diagnostico_listo":
        html = renderToStaticMarkup(React.createElement(templates.EmailDiagnosticoListo, d));
        subject = "Tu diagnóstico agronómico está listo";
        break;
      case "credito_aprobado":
        html = renderToStaticMarkup(React.createElement(templates.EmailCreditoAprobado, d));
        subject = "¡Tu línea de crédito fue aprobada!";
        break;
      default:
        return NextResponse.json({ error: `Tipo desconocido: ${type}` }, { status: 400 });
    }
  } catch (err) {
    console.error("Template render error:", err);
    return NextResponse.json({ error: "Error rendering template" }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "AgroMarket <noreply@marketplace-agro.com>",
          to, subject, html,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? "Resend error");
      return NextResponse.json({ sent: true, id: result.id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error enviando email";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  console.log(`[EMAIL DEV] to=${to} subject="${subject}"`);
  return NextResponse.json({ sent: true, dev: true, subject, to });
}
