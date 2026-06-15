import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err } from "@/lib/api/helpers";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);

    const { cropType, symptoms, urgency, description, location, stage } = await req.json();
    if (!cropType) return err("cropType es requerido", 400);

    const notes = [
      stage && `Etapa: ${stage}`,
      symptoms && (Array.isArray(symptoms) ? `Síntomas: ${symptoms.join(", ")}` : `Síntomas: ${symptoms}`),
      description && `Descripción: ${description}`,
      location && `Ubicación: ${location}`,
    ].filter(Boolean).join("\n");

    const diagnostic = await prisma.diagnostic.create({
      data: {
        buyerId: uid,
        cropType,
        urgency: (urgency === "alta" || urgency === "baja") ? urgency : "media",
        notes: notes || undefined,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return ok(diagnostic, 201);
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado — inicia sesión para enviar tu solicitud", 401);
  }
}
