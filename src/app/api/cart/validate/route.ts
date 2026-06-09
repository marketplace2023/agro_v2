import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { items, country }: { items: { productId: string; vendorId: string; quantity: number }[]; country: string } = await req.json();

    if (!items?.length) return NextResponse.json({ warnings: [] });

    const warnings: { productId: string; type: string; message: string }[] = [];
    const upperCountry = country?.toUpperCase() ?? "CO";

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          name: true, isRegulated: true, status: true,
          regulatoryRecords: {
            where: { country: upperCountry },
            select: { status: true, expiresAt: true },
          },
        },
      });

      if (!product) {
        warnings.push({ productId: item.productId, type: "no_disponible", message: "Producto no encontrado" });
        continue;
      }

      if (product.status === "bloqueado") {
        warnings.push({ productId: item.productId, type: "inactivo", message: `${product.name} está bloqueado para venta` });
        continue;
      }

      // Check vendor listing: isActive + countries + stock
      const vendor = await prisma.productVendor.findFirst({
        where: { productId: item.productId, vendorId: item.vendorId },
        select: { stock: true, isActive: true, countries: true },
      });

      if (!vendor || !vendor.isActive) {
        warnings.push({
          productId: item.productId,
          type: "inactivo",
          message: `${product.name} no está disponible en este vendedor`,
        });
        continue;
      }

      // --- Paso 63: Check RegulatoryRecord for the country ---
      if (product.isRegulated) {
        const rec = product.regulatoryRecords[0];
        if (!rec) {
          // No record at all for this country
          warnings.push({
            productId: item.productId,
            type: "regulatorio",
            message: `${product.name} no tiene registro regulatorio para ${upperCountry}. No puede enviarse a este país.`,
          });
        } else if (rec.status === "rechazado" || rec.status === "bloqueado") {
          warnings.push({
            productId: item.productId,
            type: "regulatorio_bloqueado",
            message: `${product.name} tiene registro ${rec.status} en ${upperCountry}. Venta no permitida.`,
          });
        } else if (rec.status === "vencido") {
          warnings.push({
            productId: item.productId,
            type: "regulatorio_vencido",
            message: `Registro de ${product.name} vencido en ${upperCountry} (${rec.expiresAt ? new Date(rec.expiresAt).toLocaleDateString("es-CO") : "?"}). Requiere renovación.`,
          });
        } else if (rec.status === "pendiente") {
          warnings.push({
            productId: item.productId,
            type: "regulatorio",
            message: `${product.name} tiene registro regulatorio pendiente de aprobación en ${upperCountry}.`,
          });
        }
        // status === "aprobado" → no warning
      } else if (vendor.countries.length > 0 && !vendor.countries.includes(upperCountry)) {
        // Non-regulated but vendor doesn't serve this country
        warnings.push({
          productId: item.productId,
          type: "regulatorio",
          message: `${product.name} no está disponible para envío a ${upperCountry}`,
        });
      }

      if (vendor.stock !== null && vendor.stock < item.quantity) {
        warnings.push({
          productId: item.productId,
          type: "stock",
          message: `Stock insuficiente: disponible ${vendor.stock} unidades`,
        });
      }
    }

    return NextResponse.json({ warnings });
  } catch {
    return NextResponse.json({ warnings: [], error: "Error de validación" }, { status: 500 });
  }
}
