import { requireAuth, ok, err } from "@/lib/api/helpers";

// Mensajería no tiene modelo en el schema aún.
export async function GET() {
  try {
    await requireAuth();
    return ok({ data: [], total: 0, _note: "Modelo Mensaje pendiente de migración en schema" });
  } catch { return err("No autenticado", 401); }
}

export async function POST() {
  try {
    await requireAuth();
    return err("Módulo Mensajes en desarrollo — schema pendiente", 501);
  } catch { return err("No autenticado", 401); }
}
