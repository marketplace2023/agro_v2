import { NextResponse } from "next/server";
import { getCategoriesTree } from "@/lib/catalog/service";

export async function GET() {
  try {
    const categories = await getCategoriesTree();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "No disponible" }, { status: 503 });
  }
}
