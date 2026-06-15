import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Calendar, Award } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 3600;

interface ExpertPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExpertPageProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = await prisma.expert.findUnique({
    where: { id: slug },
    select: {
      title: true,
      user: { select: { profile: { select: { firstName: true, lastName: true, bio: true } } } },
    },
  }).catch(() => null);
  if (!expert) return { title: "Experto no encontrado" };
  const profile = expert.user?.profile;
  const name = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Experto";
  return {
    title: `${name} | Expertos | Marketplace Agro`,
    description: profile?.bio ?? `${expert.title ?? "Asesor agronómico"} en Marketplace Agro`,
  };
}

export default async function ExpertPage({ params }: ExpertPageProps) {
  const { slug } = await params;

  const expert = await prisma.expert.findUnique({
    where: { id: slug },
    include: {
      user: {
        select: {
          profile: {
            select: { firstName: true, lastName: true, country: true, bio: true },
          },
        },
      },
    },
  }).catch(() => null);

  if (!expert) notFound();

  const profile = expert.user?.profile;
  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Experto";
  const initials = fullName.split(" ").map(n => n[0]).slice(0, 2).join("");
  const location = [expert.regions[0], expert.countries[0] ?? profile?.country].filter(Boolean).join(", ");

  const availabilitySlots: string[] = (() => {
    if (!expert.availability) return [];
    try {
      const av = expert.availability as Record<string, string[]>;
      return Object.entries(av).flatMap(([day, times]) =>
        (times as string[]).map(t => `${day} ${t}`)
      );
    } catch {
      return [];
    }
  })();

  return (
    <div className="container-max py-6">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <Link href="/expertos" className="hover:text-[var(--color-primary)]">Expertos</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)]">{fullName}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-2xl font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-[var(--color-on-surface)]">{fullName}</h1>
                {expert.title && (
                  <p className="text-sm text-[var(--color-on-surface-variant)]">{expert.title}</p>
                )}
                {location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-on-surface-variant)]" />
                    <span className="text-sm text-[var(--color-on-surface-variant)]">{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{expert.rating.toFixed(1)}</span>
                    <span className="text-[var(--color-on-surface-variant)]">({expert.totalConsults} consultas)</span>
                  </div>
                  {expert.isAvailable && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Disponible</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Sobre mí</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              {profile?.bio ?? "Sin biografía registrada."}
            </p>

            {expert.specialties.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-[var(--color-on-surface)] mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-1.5">
                  {expert.specialties.map((s) => (
                    <span key={s} className="text-xs bg-[var(--color-surface-container)] px-3 py-1 rounded-full border border-[var(--color-border-subtle)]">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {expert.cropTypes.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-[var(--color-on-surface)] mb-2">Cultivos de especialización</p>
                <div className="flex flex-wrap gap-1.5">
                  {expert.cropTypes.map((crop) => (
                    <Link
                      key={crop}
                      href={`/cultivos/${crop.toLowerCase()}`}
                      className="text-xs bg-[var(--color-surface-container)] hover:bg-[var(--color-primary)] hover:text-white px-3 py-1 rounded-full transition-colors border border-[var(--color-border-subtle)] capitalize"
                    >
                      {crop}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Countries / regions */}
          {(expert.countries.length > 0 || expert.regions.length > 0) && (
            <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
              <h2 className="font-semibold text-[var(--color-on-surface)] mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[var(--color-primary)]" /> Cobertura geográfica
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {[...expert.countries, ...expert.regions].map((place) => (
                  <span key={place} className="text-xs bg-[var(--color-surface-container)] px-2.5 py-1 rounded-full text-[var(--color-on-surface-variant)]">{place}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Availability */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Disponibilidad
            </h2>
            {availabilitySlots.length > 0 ? (
              <div className="space-y-2 mb-3">
                {availabilitySlots.slice(0, 5).map((slot) => (
                  <div key={slot} className="w-full px-3 py-2 rounded-lg border border-[var(--color-border-subtle)] text-sm text-[var(--color-on-surface)]">
                    {slot}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-on-surface-variant)] mb-3">Consulta disponibilidad al solicitar cita.</p>
            )}
            <Link
              href={`/asesoria-agronomica?experto=${slug}`}
              className="block w-full text-center py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Solicitar consulta
            </Link>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Calificación global</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold">{expert.rating.toFixed(1)}</span>
              <div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(expert.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{expert.totalConsults} consultas</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-border-subtle)] p-4">
            <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">¿Tienes dudas sobre este experto?</p>
            <Link href="/asesoria-agronomica" className="text-xs text-[var(--color-primary)] hover:underline">Ver todos los expertos →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
