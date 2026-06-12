import { requireAuth, ok, err } from "@/lib/api/helpers";

// Notificaciones no tienen modelo en el schema aún.
export async function GET() {
  try {
    await requireAuth();
    return ok({ data: [], total: 0, unread: 0, _note: "Modelo Notificacion pendiente de migración en schema" });
  } catch { return err("No autenticado", 401); }
}

export async function PUT() {
  try {
    await requireAuth();
    return err("Módulo Notificaciones en desarrollo — schema pendiente", 501);
  } catch { return err("No autenticado", 401); }
}
