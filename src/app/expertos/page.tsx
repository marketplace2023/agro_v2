import type { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Expertos Agronómicos | Marketplace Agro",
  description: "Directorio de asesores y especialistas agronómicos disponibles en Latinoamérica. Filtra por país, cultivo y especialidad.",
};

export const revalidate = 3600;

export default async function ExpertosPage() {
  const experts = await prisma.expert.findMany({
    where: { isAvailable: true },
    orderBy: { rating: "desc" },
    take: 30,
    include: {
      user: {
        select: {
          profile: {
            select: { firstName: true, lastName: true, country: true, bio: true },
          },
        },
      },
    },
  }).catch(() => []);

  const allCountries = Array.from(
    new Set(experts.flatMap(e => e.countries))
  ).filter(Boolean);

  const allCrops = Array.from(
    new Set(experts.flatMap(e => e.cropTypes))
  ).filter(Boolean).slice(0, 8);

  return (
    <div className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Expertos agronómicos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Asesores especializados disponibles para consultas técnicas y diagnósticos
        </p>
      </div>

      {/* Filters */}
      {(allCountries.length > 0 || allCrops.length > 0) && (
        <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 mb-6 flex flex-wrap gap-4">
          {allCountries.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">País</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white">Todos</span>
                {allCountries.slice(0, 6).map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)]">{c}</span>
                ))}
              </div>
            </div>
          )}
          {allCrops.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">Cultivo</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)] text-white">Todos</span>
                {allCrops.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border-subtle)] text-[var(--color-on-surface-variant)] capitalize">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {experts.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-on-surface-variant)]">
          <p className="text-4xl mb-3">👨‍🌾</p>
          <p className="font-medium">Sin expertos registrados aún</p>
          <p className="text-sm mt-1">Los asesores verificados aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experts.map((expert) => {
            const profile = expert.user?.profile;
            const fullName = profile
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : "Experto";
            const initials = fullName.split(" ").map(n => n[0]).slice(0, 2).join("");
            const location = [
              expert.regions[0],
              expert.countries[0] ?? profile?.country,
            ].filter(Boolean).join(", ");

            return (
              <div key={expert.id} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-base font-bold text-[var(--color-primary)] shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--color-on-surface)] text-sm">{fullName}</p>
                    {expert.title && (
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{expert.title}</p>
                    )}
                    {location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[var(--color-on-surface-variant)]" />
                        <span className="text-xs text-[var(--color-on-surface-variant)]">{location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{expert.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[var(--color-on-surface-variant)] text-xs">({expert.totalConsults} consultas)</span>
                </div>

                {expert.specialties.length > 0 && (
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-2 line-clamp-2">
                    {expert.specialties.join(" · ")}
                  </p>
                )}

                {expert.cropTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {expert.cropTypes.slice(0, 4).map((crop) => (
                      <span key={crop} className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full capitalize">{crop}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/expertos/${expert.id}`}
                    className="flex-1 text-center py-2 border border-[var(--color-border-subtle)] rounded-lg text-xs font-medium hover:bg-[var(--color-surface-container-low)] transition-colors"
                  >
                    Ver perfil
                  </Link>
                  <Link
                    href={`/asesoria-agronomica?experto=${expert.id}`}
                    className="flex-1 text-center py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Solicitar cita
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
