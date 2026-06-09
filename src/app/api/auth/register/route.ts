import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(["comprador", "vendedor", "fabricante", "distribuidor", "asesor"]),
  usageType: z.string().optional(),
  crops: z.array(z.string()).optional(),
  volume: z.string().optional(),
  companyName: z.string().optional(),
  tradeName: z.string().optional(),
  taxId: z.string().optional(),
  companyType: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  categories: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Este email ya está registrado." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        emailVerified: null,
        profile: {
          create: {
            firstName: data.name,
            lastName: data.lastName ?? "—",
            phone: data.phone,
            country: data.country,
          },
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    console.error("[register]", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
