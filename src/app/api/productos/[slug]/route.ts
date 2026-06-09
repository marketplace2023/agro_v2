import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/catalog/service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "No disponible" }, { status: 503 });
  }
}
