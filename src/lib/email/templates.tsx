import React from "react";

// Base layout shared by all email templates
function EmailLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f4f4f4", fontFamily: "'Open Sans', Arial, sans-serif" }}>
        <table width="100%" cellPadding={0} cellSpacing={0}>
          <tr>
            <td align="center" style={{ padding: "32px 16px" }}>
              <table width="600" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", maxWidth: "600px" }}>
                {/* Header */}
                <tr>
                  <td style={{ backgroundColor: "#005c72", padding: "24px 32px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "bold", color: "#ffffff", fontFamily: "Arial" }}>AgroMarket</span>
                    <span style={{ display: "block", fontSize: "12px", color: "#a8d5e2", marginTop: "2px" }}>Marketplace Agro Latinoamérica</span>
                  </td>
                </tr>
                {/* Content */}
                <tr>
                  <td style={{ padding: "32px" }}>{children}</td>
                </tr>
                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: "#f9fafb", padding: "16px 32px", borderTop: "1px solid #E5E5E5" }}>
                    <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
                      AgroMarket · marketplace-agro.com · soporte@marketplace-agro.com<br />
                      Si no solicitaste esto, puedes ignorar este correo.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h1 style={{ margin: "0 0 8px", fontSize: "22px", color: "#1a1c1d", fontWeight: "bold" }}>{children}</h1>;
}

function Subtext({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 16px", fontSize: "14px", color: "#3f484c", lineHeight: "1.6" }}>{children}</p>;
}

function Button({ href, children, color = "#005c72" }: { href: string; children: React.ReactNode; color?: string }) {
  return (
    <a href={href} style={{ display: "inline-block", backgroundColor: color, color: "#ffffff", padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", textDecoration: "none", marginTop: "8px" }}>
      {children}
    </a>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: "6px 0", borderBottom: "1px solid #E5E5E5" }}>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>{label}</span><br />
        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#1a1c1d" }}>{value}</span>
      </td>
    </tr>
  );
}

// ─── 1. Confirmación de orden ────────────────────────────────────────────────
interface OrderConfirmProps {
  buyerName: string;
  orderId: string;
  total: string;
  vendedor: string;
  fecha: string;
  orderUrl: string;
}
export function EmailOrdenConfirmada({ buyerName, orderId, total, vendedor, fecha, orderUrl }: OrderConfirmProps) {
  return (
    <EmailLayout title={`Orden confirmada ${orderId}`}>
      <Heading>¡Tu orden fue confirmada!</Heading>
      <Subtext>Hola {buyerName}, {vendedor} ha confirmado tu pedido y está siendo procesado.</Subtext>
      <table cellPadding={0} cellSpacing={0} width="100%" style={{ marginBottom: "24px" }}>
        <InfoBox label="Número de orden" value={orderId} />
        <InfoBox label="Vendedor" value={vendedor} />
        <InfoBox label="Fecha" value={fecha} />
        <InfoBox label="Total" value={total} />
      </table>
      <Button href={orderUrl}>Ver mi orden →</Button>
    </EmailLayout>
  );
}

// ─── 2. Pago recibido ─────────────────────────────────────────────────────────
interface PaymentProps {
  buyerName: string;
  orderId: string;
  monto: string;
  metodo: string;
  referencia: string;
  orderUrl: string;
}
export function EmailPagoRecibido({ buyerName, orderId, monto, metodo, referencia, orderUrl }: PaymentProps) {
  return (
    <EmailLayout title="Pago recibido">
      <Heading>Pago recibido exitosamente</Heading>
      <Subtext>Hola {buyerName}, confirmamos la recepción de tu pago.</Subtext>
      <table cellPadding={0} cellSpacing={0} width="100%" style={{ marginBottom: "24px" }}>
        <InfoBox label="Orden" value={orderId} />
        <InfoBox label="Monto" value={monto} />
        <InfoBox label="Método" value={metodo} />
        <InfoBox label="Referencia" value={referencia} />
      </table>
      <Button href={orderUrl} color="#2B5F2B">Ver comprobante →</Button>
    </EmailLayout>
  );
}

// ─── 3. Despacho / orden en tránsito ─────────────────────────────────────────
interface ShipmentProps {
  buyerName: string;
  orderId: string;
  guia: string;
  transportista: string;
  estimatedDelivery: string;
  trackingUrl: string;
}
export function EmailOrdenDespachada({ buyerName, orderId, guia, transportista, estimatedDelivery, trackingUrl }: ShipmentProps) {
  return (
    <EmailLayout title="Tu pedido está en camino">
      <Heading>¡Tu pedido está en camino!</Heading>
      <Subtext>Hola {buyerName}, tu orden {orderId} fue despachada y está en tránsito.</Subtext>
      <table cellPadding={0} cellSpacing={0} width="100%" style={{ marginBottom: "24px" }}>
        <InfoBox label="Guía de transporte" value={guia} />
        <InfoBox label="Transportista" value={transportista} />
        <InfoBox label="Entrega estimada" value={estimatedDelivery} />
      </table>
      <Button href={trackingUrl} color="#bc000a">Rastrear envío →</Button>
    </EmailLayout>
  );
}

// ─── 4. Entrega confirmada ────────────────────────────────────────────────────
interface DeliveryProps {
  buyerName: string;
  orderId: string;
  fecha: string;
  reviewUrl: string;
}
export function EmailOrdenEntregada({ buyerName, orderId, fecha, reviewUrl }: DeliveryProps) {
  return (
    <EmailLayout title="Pedido entregado">
      <Heading>Pedido entregado con éxito</Heading>
      <Subtext>Hola {buyerName}, tu orden {orderId} fue entregada el {fecha}. ¡Esperamos que estés satisfecho con tu compra!</Subtext>
      <Subtext>¿Cómo fue tu experiencia? Tu opinión ayuda a otros compradores del mercado agro.</Subtext>
      <Button href={reviewUrl} color="#2B5F2B">Calificar compra →</Button>
    </EmailLayout>
  );
}

// ─── 5. Nueva cotización (RFQ) recibida ──────────────────────────────────────
interface RFQProps {
  vendorName: string;
  rfqId: string;
  comprador: string;
  producto: string;
  pais: string;
  vence: string;
  rfqUrl: string;
}
export function EmailNuevaRFQ({ vendorName, rfqId, comprador, producto, pais, vence, rfqUrl }: RFQProps) {
  return (
    <EmailLayout title={`Nueva cotización ${rfqId}`}>
      <Heading>Nueva solicitud de cotización</Heading>
      <Subtext>Hola {vendorName}, recibiste una nueva RFQ de {comprador}.</Subtext>
      <table cellPadding={0} cellSpacing={0} width="100%" style={{ marginBottom: "24px" }}>
        <InfoBox label="RFQ ID" value={rfqId} />
        <InfoBox label="Producto solicitado" value={producto} />
        <InfoBox label="País de destino" value={pais} />
        <InfoBox label="Válida hasta" value={vence} />
      </table>
      <Button href={rfqUrl}>Responder cotización →</Button>
    </EmailLayout>
  );
}

// ─── 6. Aprobación corporativa ────────────────────────────────────────────────
interface ApprovalProps {
  approverName: string;
  orderId: string;
  solicitante: string;
  monto: string;
  sede: string;
  approveUrl: string;
}
export function EmailAprobacionPendiente({ approverName, orderId, solicitante, monto, sede, approveUrl }: ApprovalProps) {
  return (
    <EmailLayout title="Aprobación requerida">
      <Heading>Aprobación de compra requerida</Heading>
      <Subtext>Hola {approverName}, la orden {orderId} requiere tu aprobación.</Subtext>
      <table cellPadding={0} cellSpacing={0} width="100%" style={{ marginBottom: "24px" }}>
        <InfoBox label="Solicitante" value={solicitante} />
        <InfoBox label="Sede" value={sede} />
        <InfoBox label="Monto total" value={monto} />
        <InfoBox label="Orden" value={orderId} />
      </table>
      <Button href={approveUrl} color="#484d94">Revisar y aprobar →</Button>
    </EmailLayout>
  );
}

// ─── 7. Diagnóstico agronómico listo ─────────────────────────────────────────
interface DiagnosticProps {
  clientName: string;
  cultivo: string;
  asesor: string;
  diagnosticoUrl: string;
}
export function EmailDiagnosticoListo({ clientName, cultivo, asesor, diagnosticoUrl }: DiagnosticProps) {
  return (
    <EmailLayout title="Diagnóstico agronómico listo">
      <Heading>Tu diagnóstico está listo</Heading>
      <Subtext>Hola {clientName}, el asesor {asesor} completó el diagnóstico agronómico para tu cultivo de {cultivo}.</Subtext>
      <Subtext>Incluye análisis de suelos, identificación de plagas/enfermedades, recomendaciones de productos y plan de fertilización.</Subtext>
      <Button href={diagnosticoUrl} color="#2B5F2B">Ver diagnóstico →</Button>
    </EmailLayout>
  );
}

// ─── 8. Crédito aprobado ──────────────────────────────────────────────────────
interface CreditProps {
  buyerName: string;
  lineaCredito: string;
  plazo: string;
  vencimiento: string;
  dashboardUrl: string;
}
export function EmailCreditoAprobado({ buyerName, lineaCredito, plazo, vencimiento, dashboardUrl }: CreditProps) {
  return (
    <EmailLayout title="Línea de crédito aprobada">
      <Heading>¡Línea de crédito aprobada!</Heading>
      <Subtext>Hola {buyerName}, nos complace informarte que tu solicitud de crédito fue aprobada.</Subtext>
      <table cellPadding={0} cellSpacing={0} width="100%" style={{ marginBottom: "24px" }}>
        <InfoBox label="Línea de crédito" value={lineaCredito} />
        <InfoBox label="Plazo" value={plazo} />
        <InfoBox label="Válido hasta" value={vencimiento} />
      </table>
      <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6b7280", lineHeight: "1.6" }}>
        Puedes usar tu crédito en cualquier compra dentro de AgroMarket. Consulta condiciones completas en tu dashboard.
      </p>
      <Button href={dashboardUrl} color="#2B5F2B">Ir a mi cuenta →</Button>
    </EmailLayout>
  );
}
