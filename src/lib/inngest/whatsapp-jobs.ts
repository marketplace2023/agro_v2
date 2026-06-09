import { inngest } from "./client";

const WA_API_URL = "https://graph.facebook.com/v20.0";

async function sendWhatsApp(to: string, templateName: string, components: unknown[]) {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneId || !token) {
    console.log(`[WA DEV] to=${to} template=${templateName}`, JSON.stringify(components));
    return { dev: true };
  }

  const res = await fetch(`${WA_API_URL}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: "es" },
        components,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error: ${err}`);
  }

  return res.json();
}

// ─── 1. Orden confirmada ───────────────────────────────────────────────────
export const waOrdenConfirmada = inngest.createFunction(
  {
    id: "wa-orden-confirmada",
    name: "WhatsApp: Orden Confirmada",
    triggers: [{ event: "orden/confirmada" }],
  },
  async ({ event, step }: { event: { data: Record<string, string> }; step: { run: (name: string, fn: () => unknown) => unknown } }) => {
    const { phone, buyerName, orderId, total, vendedor } = event.data;

    await step.run("send-whatsapp", () =>
      sendWhatsApp(phone, "orden_confirmada", [
        {
          type: "body",
          parameters: [
            { type: "text", text: buyerName },
            { type: "text", text: orderId },
            { type: "text", text: vendedor },
            { type: "text", text: total },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: orderId }],
        },
      ])
    );
  }
);

// ─── 2. Pago recibido ──────────────────────────────────────────────────────
export const waPagoRecibido = inngest.createFunction(
  {
    id: "wa-pago-recibido",
    name: "WhatsApp: Pago Recibido",
    triggers: [{ event: "pago/recibido" }],
  },
  async ({ event, step }: { event: { data: Record<string, string> }; step: { run: (name: string, fn: () => unknown) => unknown } }) => {
    const { phone, buyerName, orderId, monto, metodo } = event.data;

    await step.run("send-whatsapp", () =>
      sendWhatsApp(phone, "pago_recibido", [
        {
          type: "body",
          parameters: [
            { type: "text", text: buyerName },
            { type: "text", text: monto },
            { type: "text", text: metodo },
            { type: "text", text: orderId },
          ],
        },
      ])
    );
  }
);

// ─── 3. Orden en tránsito ──────────────────────────────────────────────────
export const waOrdenDespachada = inngest.createFunction(
  {
    id: "wa-orden-despachada",
    name: "WhatsApp: Orden Despachada",
    triggers: [{ event: "orden/despachada" }],
  },
  async ({ event, step }: { event: { data: Record<string, string> }; step: { run: (name: string, fn: () => unknown) => unknown } }) => {
    const { phone, buyerName, orderId, guia, transportista, estimatedDelivery } = event.data;

    await step.run("send-whatsapp", () =>
      sendWhatsApp(phone, "orden_despachada", [
        {
          type: "body",
          parameters: [
            { type: "text", text: buyerName },
            { type: "text", text: orderId },
            { type: "text", text: guia },
            { type: "text", text: transportista },
            { type: "text", text: estimatedDelivery },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: guia }],
        },
      ])
    );
  }
);

// ─── 4. Aprobación corporativa requerida ──────────────────────────────────
export const waAprobacionRequerida = inngest.createFunction(
  {
    id: "wa-aprobacion-requerida",
    name: "WhatsApp: Aprobación Requerida",
    triggers: [{ event: "aprobacion/requerida" }],
  },
  async ({ event, step }: { event: { data: Record<string, string> }; step: { run: (name: string, fn: () => unknown) => unknown } }) => {
    const { phone, approverName, orderId, solicitante, monto } = event.data;

    await step.run("send-whatsapp", () =>
      sendWhatsApp(phone, "aprobacion_requerida", [
        {
          type: "body",
          parameters: [
            { type: "text", text: approverName },
            { type: "text", text: orderId },
            { type: "text", text: solicitante },
            { type: "text", text: monto },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: orderId }],
        },
      ])
    );
  }
);

// ─── 5. RFQ nueva (notificación a vendedor) ──────────────────────────────
export const waRFQNueva = inngest.createFunction(
  {
    id: "wa-rfq-nueva",
    name: "WhatsApp: Nueva RFQ",
    triggers: [{ event: "rfq/nueva" }],
  },
  async ({ event, step }: { event: { data: Record<string, string> }; step: { run: (name: string, fn: () => unknown) => unknown } }) => {
    const { phone, vendorName, rfqId, comprador, producto, vence } = event.data;

    await step.run("send-whatsapp", () =>
      sendWhatsApp(phone, "nueva_rfq", [
        {
          type: "body",
          parameters: [
            { type: "text", text: vendorName },
            { type: "text", text: rfqId },
            { type: "text", text: comprador },
            { type: "text", text: producto },
            { type: "text", text: vence },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [{ type: "text", text: rfqId }],
        },
      ])
    );
  }
);
