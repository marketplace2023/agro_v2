import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err } from "@/lib/api/helpers";

export async function GET() {
  try {
    const session = await requireAuth();
    const uid = userId(session);

    const expert = await prisma.expert.findUnique({
      where: { userId: uid },
      select: { regions: true, countries: true },
    });

    const regions: string[] = expert?.regions ?? [];

    if (regions.length === 0) {
      return ok({ regions: [], summary: { total: 0, alta: 0, media: 0, baja: 0 } });
    }

    const diagnostics = await prisma.diagnostic.findMany({
      where: { region: { in: regions } },
      select: { region: true, urgency: true, status: true, cropType: true, country: true },
    });

    const regionMap: Record<string, {
      name: string;
      total: number;
      alta: number;
      pendientes: number;
      crops: Record<string, number>;
    }> = {};

    for (const r of regions) {
      regionMap[r] = { name: r, total: 0, alta: 0, pendientes: 0, crops: {} };
    }

    for (const d of diagnostics) {
      const zone = d.region ?? "Sin región";
      if (!regionMap[zone]) {
        regionMap[zone] = { name: zone, total: 0, alta: 0, pendientes: 0, crops: {} };
      }
      regionMap[zone].total++;
      if (d.urgency === "alta")         regionMap[zone].alta++;
      if (d.status !== "respondido" && d.status !== "cerrado") regionMap[zone].pendientes++;
      regionMap[zone].crops[d.cropType] = (regionMap[zone].crops[d.cropType] ?? 0) + 1;
    }

    const summary = {
      total: diagnostics.length,
      alta:  diagnostics.filter((d) => d.urgency === "alta").length,
      media: diagnostics.filter((d) => d.urgency === "media").length,
      baja:  diagnostics.filter((d) => d.urgency === "baja").length,
    };

    return ok({ regions: Object.values(regionMap), summary });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
