import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Calendar, Award } from "lucide-react";

export const revalidate = 3600;

const EXPERTS_DATA: Record<string, {
  name: string; title: string; country: string; city: string;
  rating: number; consultations: number; specialty: string;
  crops: string[]; availability: string; bio: string;
  certifications: string[]; experience: number;
  weeklySlots: string[];
}> = {
  "carlos-ramirez": {
    name: "Ing. Carlos Ramírez", title: "Agrónomo — Nutrición Vegetal", country: "Colombia", city: "Medellín, Antioquia",
    rating: 4.9, consultations: 87, specialty: "Fertilización en café y maíz",
    crops: ["Café", "Maíz", "Papa", "Plátano"], availability: "Lunes",
    bio: "Ingeniero Agrónomo con 15 años de experiencia en nutrición vegetal y manejo integrado de cultivos. Especialista en sistemas de fertirrigación y biología del suelo. Ha trabajado con más de 200 productores en Antioquia, Eje Cafetero y Nariño.",
    certifications: ["Ingeniero Agrónomo - Universidad Nacional de Colombia", "Especialista en Suelos - CIAT", "Certificado CCA (Consultor Certificado en Agronomía)"],
    experience: 15,
    weeklySlots: ["Lunes 9:00 AM", "Lunes 2:00 PM", "Miércoles 10:00 AM", "Viernes 3:00 PM"],
  },
  "maria-gonzalez": {
    name: "Dra. María González", title: "Fitopatóloga", country: "Ecuador", city: "Guayaquil, Guayas",
    rating: 4.8, consultations: 64, specialty: "Enfermedades en hortalizas y banano",
    crops: ["Tomate", "Banano", "Aguacate", "Cacao"], availability: "Martes",
    bio: "Doctora en Fitopatología con enfoque en enfermedades tropicales. Investigadora del INIAP Ecuador por 10 años. Especialista en diagnosticar y tratar enfermedades fúngicas y bacterianas en cultivos de exportación.",
    certifications: ["Doctorado en Fitopatología - Universidad de Florida", "Investigadora INIAP", "Especialista en biológicos IOBC"],
    experience: 12,
    weeklySlots: ["Martes 8:00 AM", "Martes 3:00 PM", "Jueves 10:00 AM"],
  },
};

interface ExpertPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExpertPageProps): Promise<Metadata> {
  const { slug } = await params;
  const expert = EXPERTS_DATA[slug];
  if (!expert) return { title: "Experto no encontrado" };
  return {
    title: `${expert.name} | Expertos | Marketplace Agro`,
    description: expert.bio,
  };
}

export default async function ExpertPage({ params }: ExpertPageProps) {
  const { slug } = await params;
  const expert = EXPERTS_DATA[slug];
  if (!expert) notFound();

  return (
    <div className="container-max py-6">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-4">
        <Link href="/" className="hover:text-[var(--color-primary)]">Inicio</Link>
        <span>/</span>
        <Link href="/expertos" className="hover:text-[var(--color-primary)]">Expertos</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface)]">{expert.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                {expert.name.split(" ").map((n) => n[0]).slice(1, 3).join("")}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-[var(--color-on-surface)]">{expert.name}</h1>
                <p className="text-sm text-[var(--color-on-surface-variant)]">{expert.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-on-surface-variant)]" />
                  <span className="text-sm text-[var(--color-on-surface-variant)]">{expert.city}, {expert.country}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
                    <span className="font-semibold">{expert.rating}</span>
                    <span className="text-[var(--color-on-surface-variant)]">({expert.consultations} consultas)</span>
                  </div>
                  <span className="text-[var(--color-on-surface-variant)]">·</span>
                  <span className="text-[var(--color-on-surface-variant)]">{expert.experience} años de experiencia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Sobre mí</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{expert.bio}</p>
            <div className="mt-4">
              <p className="text-sm font-medium text-[var(--color-on-surface)] mb-2">Cultivos de especialización</p>
              <div className="flex flex-wrap gap-1.5">
                {expert.crops.map((crop) => (
                  <Link key={crop} href={`/cultivos/${crop.toLowerCase()}`} className="text-xs bg-[var(--color-surface-container)] hover:bg-[var(--color-primary)] hover:text-white px-3 py-1 rounded-full transition-colors border border-[var(--color-border-subtle)]">
                    {crop}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Formación y certificaciones</h2>
            <ul className="space-y-2">
              {expert.certifications.map((cert) => (
                <li key={cert} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                  <Award className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Availability */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">
              <Calendar className="inline w-4 h-4 mr-1" />
              Disponibilidad
            </h2>
            <div className="space-y-2">
              {expert.weeklySlots.map((slot) => (
                <button key={slot} className="w-full text-left px-3 py-2 rounded-lg border border-[var(--color-border-subtle)] text-sm hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] transition-colors">
                  {slot}
                </button>
              ))}
            </div>
            <Link href={`/asesoria-agronomica?experto=${slug}`} className="mt-3 block w-full text-center py-2.5 bg-[var(--color-primary)] text-white font-medium rounded-lg text-sm hover:bg-[var(--color-primary-container)] transition-colors">
              Solicitar consulta
            </Link>
          </div>

          {/* Rating breakdown */}
          <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Calificación</h2>
            {[
              { label: "Conocimiento técnico", score: 5.0 },
              { label: "Claridad de respuesta", score: 4.9 },
              { label: "Tiempo de respuesta", score: 4.8 },
              { label: "Soluciones prácticas", score: 4.9 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 mb-2">
                <span className="flex-1 text-xs text-[var(--color-on-surface-variant)]">{item.label}</span>
                <span className="text-sm font-semibold">{item.score}</span>
                <Star className="w-3.5 h-3.5 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
