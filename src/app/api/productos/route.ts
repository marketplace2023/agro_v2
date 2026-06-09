import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") ?? undefined;
  const categoriaSlug = searchParams.get("categoria") ?? undefined;
  const pais = searchParams.get("pais") ?? undefined;
  const regulado = searchParams.get("regulado") === "1" ? true : undefined;
  const biologico = searchParams.get("biologico") === "1" ? true : undefined;
  const organico = searchParams.get("organico") === "1" ? true : undefined;
  const orden = searchParams.get("orden") ?? "nuevos";
  const pagina = Math.max(1, parseInt(searchParams.get("pagina") ?? "1", 10));
  const limite = Math.min(
    48,
    Math.max(1, parseInt(searchParams.get("limite") ?? "24", 10)),
  );

  try {
    const result = await getProducts({
      q,
      categoriaSlug,
      pais,
      regulado,
      biologico,
      organico,
      orden,
      pagina,
      limite,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "No disponible" }, { status: 503 });
  }
}
