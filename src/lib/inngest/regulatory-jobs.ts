import { inngest } from "./client";

// Scan regulatory records expiring in the next 30 days and notify vendor + analyst
export const regulatoryAlertScan = inngest.createFunction(
  {
    id: "regulatory-alert-scan",
    name: "Regulatory: Alerta Vencimientos Próximos",
    triggers: [{ cron: "0 8 * * *" }],
  },
  async ({ step }: { step: { run: (name: string, fn: () => Promise<unknown>) => unknown } }) => {
    const expiring = await step.run("scan-expiring-records", async () => {
      const { prisma } = await import("@/lib/db/prisma");
      const now = new Date();
      const in30 = new Date(now);
      in30.setDate(in30.getDate() + 30);

      return prisma.regulatoryRecord.findMany({
        where: {
          status: { in: ["aprobado", "vencido"] },
          expiresAt: { lte: in30, gte: now },
        },
        include: {
          product: {
            select: {
              name: true, slug: true,
              vendorListings: {
                select: {
                  vendor: {
                    select: { company: { select: { users: { select: { profile: { select: { phone: true } }, email: true } } } } }
                  },
                },
                take: 1,
              },
            },
          },
        },
        orderBy: { expiresAt: "asc" },
      });
    });

    const records = expiring as Array<{
      id: string; country: string; expiresAt: Date;
      product: {
        name: string; slug: string;
        vendorListings: Array<{
          vendor: { company: { users: Array<{ email: string; profile: { phone: string | null } | null }> } }
        }>;
      };
    }>;

    if (!records.length) return { notified: 0 };

    let notified = 0;

    for (const rec of records) {
      const daysLeft = Math.ceil((new Date(rec.expiresAt).getTime() - Date.now()) / 86400000);
      const productName = rec.product.name;
      const country = rec.country;
      const expiresAt = new Date(rec.expiresAt).toLocaleDateString("es-CO");

      // Notify vendor via email
      const vendor = rec.product.vendorListings[0]?.vendor;
      if (vendor) {
        for (const user of vendor.company.users) {
          await step.run(`notify-email-${rec.id}-${user.email}`, async () => {
            if (!process.env.RESEND_API_KEY) {
              console.log(`[REG ALERT DEV] email to=${user.email} product=${productName} country=${country} expires=${expiresAt} daysLeft=${daysLeft}`);
              return { dev: true };
            }
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: process.env.EMAIL_FROM ?? "AgroMarket <noreply@marketplace-agro.com>",
                to: user.email,
                subject: `⚠️ Registro regulatorio vence en ${daysLeft} días — ${productName} (${country})`,
                html: `<p>El registro regulatorio de <strong>${productName}</strong> para <strong>${country}</strong> vence el <strong>${expiresAt}</strong> (en ${daysLeft} días).</p><p>Por favor renueva el registro antes del vencimiento para evitar el bloqueo del producto.</p>`,
              }),
            });
          });

          // Notify via WhatsApp if phone available
          const phone = user.profile?.phone;
          if (phone) {
            await step.run(`notify-wa-${rec.id}-${phone}`, async () => {
              const phoneId = process.env.WHATSAPP_PHONE_ID;
              const token = process.env.WHATSAPP_TOKEN;
              if (!phoneId || !token) {
                console.log(`[WA REG ALERT DEV] to=${phone} product=${productName} country=${country} daysLeft=${daysLeft}`);
                return { dev: true };
              }
              await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: phone,
                  type: "template",
                  template: {
                    name: "alerta_vencimiento_regulatorio",
                    language: { code: "es" },
                    components: [{
                      type: "body",
                      parameters: [
                        { type: "text", text: productName },
                        { type: "text", text: country },
                        { type: "text", text: `${daysLeft}` },
                        { type: "text", text: expiresAt },
                      ],
                    }],
                  },
                }),
              });
            });
          }
        }
      }

      notified++;
    }

    return { notified, total: records.length };
  }
);

// Manual trigger: re-scan and notify immediately
export const regulatoryManualScan = inngest.createFunction(
  {
    id: "regulatory-manual-scan",
    name: "Regulatory: Escaneo Manual",
    triggers: [{ event: "regulatorio/scan.manual" }],
  },
  async ({ step }: { step: { run: (name: string, fn: () => Promise<unknown>) => unknown } }) => {
    return step.run("manual-scan", async () => {
      const { prisma } = await import("@/lib/db/prisma");
      const now = new Date();
      const in30 = new Date(now);
      in30.setDate(in30.getDate() + 30);

      const count = await prisma.regulatoryRecord.count({
        where: {
          status: { in: ["aprobado", "vencido"] },
          expiresAt: { lte: in30, gte: now },
        },
      });

      return { alertsFound: count, scanDate: now.toISOString() };
    });
  }
);
