import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// POST /api/webhooks/stripe
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: { type: string; data: { object: Record<string, any> } };

  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET) as any;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Webhook error";
      console.error("Stripe webhook signature error:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } else {
    try { event = JSON.parse(body); }
    catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const orderId = pi.metadata?.orderId as string | undefined;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "confirmada",
              payment: {
                upsert: {
                  create: {
                    method: "stripe",
                    amount: typeof pi.amount === "number" ? pi.amount / 100 : 0,
                    currency: typeof pi.currency === "string" ? pi.currency : "usd",
                    stripeIntentId: typeof pi.id === "string" ? pi.id : null,
                    status: "pagado",
                    confirmedAt: new Date(),
                  },
                  update: {
                    status: "pagado",
                    confirmedAt: new Date(),
                  },
                },
              },
            },
          }).catch(() => {});
        }
        break;
      }

      case "charge.dispute.created": {
        console.warn("Stripe dispute opened:", event.data.object.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        const orderId = pi.metadata?.orderId as string | undefined;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "cancelada" },
          }).catch(() => {});
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook processing error";
    console.error("Stripe webhook processing error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
