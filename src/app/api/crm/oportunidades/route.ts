import { requireAuth, userRole, ok, err } from "@/lib/api/helpers";

export async function GET() {
  try {
    const session = await requireAuth();
    const role = userRole(session);
    if (!["vendedor", "representante", "admin"].includes(role)) return err("Sin permiso", 403);
    return ok({ data: [], total: 0, _note: "Modelo CRM pendiente de migración en schema" });
  } catch { return err("No autenticado", 401); }
}
