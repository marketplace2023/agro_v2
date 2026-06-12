import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

// CRM no tiene modelo en el schema aún. Retorna estructura vacía lista para conectar.
export async function GET() {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!["vendedor", "representante", "admin"].includes(role)) return err("Sin permiso", 403);
    return ok({ data: [], total: 0, _note: "Modelo CRM pendiente de migración en schema" });
  } catch { return err("No autenticado", 401); }
}

export async function POST() {
  try {
    await requireAuth();
    return err("Módulo CRM en desarrollo — schema pendiente", 501);
  } catch { return err("No autenticado", 401); }
}
