import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

// POST /api/checkout/intent
// Creates a Stripe PaymentIntent for the order total
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { amount, currency = "usd", metadata = {} } = await req.json();

  if (!amount || amount <= 0) return NextResponse.json({ error: "Monto inválido" }, { status: 400 });

  // Stripe integration — requires STRIPE_SECRET_KEY env var
  // npm install stripe  →  add to package.json
  if (!process.env.STRIPE_SECRET_KEY) {
    // Development mode: return mock client_secret
    return NextResponse.json({
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      paymentIntentId: `pi_mock_${Date.now()}`,
      amount,
      currency,
    });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      metadata: {
        userId: session.user.id,
        ...metadata,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear intento de pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
