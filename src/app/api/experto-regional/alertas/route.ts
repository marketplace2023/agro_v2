import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, userId, ok, err, paginate } from "@/lib/api/helpers";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const uid = userId(session);
    const { skip, limit } = paginate(req);
    const url = new URL(req.url);
    const urgency = url.searchParams.get("urgency") ?? undefined;
    const status  = url.searchParams.get("status")  ?? undefined;

    const expert = await prisma.expert.findUnique({
      where: { userId: uid },
      select: { regions: true, countries: true },
    });

    const where = {
      ...(expert?.regions?.length ? { region: { in: expert.regions } } : {}),
      ...(urgency && { urgency: urgency as never }),
      ...(status  && { status:  status  as never }),
    };

    const [data, total] = await Promise.all([
      prisma.diagnostic.findMany({
        where,
        select: {
          id: true, cropType: true, problemType: true, description: true,
          region: true, country: true, areaHa: true, urgency: true, status: true,
          symptoms: true, diagnosisText: true, cause: true, createdAt: true,
          buyer: { select: { email: true, profile: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: [{ urgency: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.diagnostic.count({ where }),
    ]);

    return ok({ data, total, page: Math.floor(skip / limit) + 1, limit });
  } catch (e) {
    if (e instanceof Response) return e;
    return err("No autenticado", 401);
  }
}
