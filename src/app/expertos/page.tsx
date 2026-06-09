import type { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Expertos Agronómicos | Marketplace Agro",
  description: "Directorio de asesores y especialistas agronómicos disponibles en Latinoamérica. Filtra por país, cultivo y especialidad.",
};

const EXPERTS = [
  { slug: "carlos-ramirez", name: "Ing. Carlos Ramírez", title: "Agrónomo", country: "Colombia", city: "Medellín", rating: 4.9, consultations: 87, specialty: "Fertilización en café y maíz", crops: ["Café", "Maíz", "Papa"], availability: "Lunes", photo: null },
  { slug: "maria-gonzalez", name: "Dra. María González", title: "Fitopatóloga", country: "Ecuador", city: "Guayaquil", rating: 4.8, consultations: 64, specialty: "Enfermedades en hortalizas y banano", crops: ["Tomate", "Banano", "Aguacate"], availability: "Martes", photo: null },
  { slug: "jose-herrera", name: "MSc. José Herrera", title: "Especialista en biológicos", country: "México", city: "Guadalajara", rating: 4.7, consultations: 102, specialty: "Agricultura biológica y control integrado", crops: ["Aguacate", "Cítricos", "Maíz"], availability: "Miércoles", photo: null },
  { slug: "ana-perez", name: "Ing. Ana Pérez", title: "Nutricionista vegetal", country: "Colombia", city: "Bogotá", rating: 4.9, consultations: 145, specialty: "Nutrición vegetal y fertirrigación", crops: ["Tomate", "Papa", "Hortalizas"], availability: "Jueves", photo: null },
  { slug: "luis-vargas", name: "Ing. Luis Vargas", title: "Entomólogo", country: "Venezuela", city: "Valencia", rating: 4.6, consultations: 53, specialty: "Control de plagas en cereales", crops: ["Maíz", "Arroz", "Soya"], availability: "Viernes", photo: null },
  { slug: "laura-mendez", name: "Dra. Laura Méndez", title: "Edafóloga", country: "Perú", city: "Lima", rating: 4.8, consultations: 78, specialty: "Suelos tropicales y cultivos andinos", crops: ["Papa", "Maíz", "Cacao"], availability: "Lunes", photo: null },
];

const COUNTRIES = ["Todos", "Colombia", "Ecuador", "México", "Venezuela", "Perú", "Brasil"];
const CROPS = ["Todos", "Café", "Maíz", "Tomate", "Papa", "Banano", "Aguacate", "Arroz"];

export default function ExpertosPage() {
  return (
    <div className="container-max py-8">
      <div className="mb-8">
        <h1 className="text-headline-lg text-[var(--color-on-surface)]">Expertos agronómicos</h1>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
          Asesores especializados disponibles para consultas técnicas y diagnósticos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-4 mb-6 flex flex-wrap gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">País</p>
          <div className="flex flex-wrap gap-1.5">
            {COUNTRIES.map((c) => (
              <button key={c} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${c === "Todos" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">Cultivo</p>
          <div className="flex flex-wrap gap-1.5">
            {CROPS.map((c) => (
              <button key={c} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${c === "Todos" ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]" : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {EXPERTS.map((expert) => (
          <div key={expert.slug} className="bg-white rounded-xl border border-[var(--color-border-subtle)] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-lg font-bold text-[var(--color-primary)] flex-shrink-0">
                {expert.name.split(" ").map((n) => n[0]).slice(1, 3).join("")}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--color-on-surface)] text-sm">{expert.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">{expert.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[var(--color-on-surface-variant)]" />
                  <span className="text-xs text-[var(--color-on-surface-variant)]">{expert.city}, {expert.country}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[var(--color-rating-stars)] text-[var(--color-rating-stars)]" />
                <span className="font-semibold">{expert.rating}</span>
              </div>
              <span className="text-[var(--color-on-surface-variant)] text-xs">({expert.consultations} consultas)</span>
            </div>

            <p className="text-xs text-[var(--color-on-surface-variant)] mb-2">{expert.specialty}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {expert.crops.map((crop) => (
                <span key={crop} className="text-xs bg-[var(--color-surface-container)] px-2 py-0.5 rounded-full">{crop}</span>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)] mb-3">
              <Calendar className="w-3 h-3" />
              <span>Próxima disponibilidad: {expert.availability}</span>
            </div>

            <div className="flex gap-2">
              <Link href={`/expertos/${expert.slug}`} className="flex-1 text-center py-2 border border-[var(--color-border-subtle)] rounded-lg text-xs font-medium hover:bg-[var(--color-surface-container-low)] transition-colors">
                Ver perfil
              </Link>
              <Link href={`/asesoria-agronomica?experto=${expert.slug}`} className="flex-1 text-center py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-container)] transition-colors">
                Solicitar cita
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
