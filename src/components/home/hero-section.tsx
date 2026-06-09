"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  FileText,
  Building2,
  MessageSquare,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  "Colombia",
  "México",
  "Brasil",
  "Argentina",
  "Perú",
  "Chile",
  "Ecuador",
  "Bolivia",
  "Paraguay",
  "Venezuela",
];
const CROPS = [
  "Maíz",
  "Café",
  "Caña de azúcar",
  "Tomate",
  "Papa",
  "Banano",
  "Aguacate",
  "Cacao",
  "Arroz",
  "Soya",
];
const TABS = [
  { id: "buy", label: "Quiero comprar", icon: ShoppingBag },
  { id: "sell", label: "Quiero vender", icon: Building2 },
  { id: "rfq", label: "Cotización", icon: FileText },
  { id: "advice", label: "Asesoría técnica", icon: MessageSquare },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("buy");

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim())
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#003a48] via-[var(--color-primary)] to-[var(--color-tertiary)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative container-max py-14 md:py-20">
        <div className="text-center text-white mb-8 max-w-3xl mx-auto">
          <h1 className="text-headline-xl mb-4">
            El marketplace de agroinsumos para Latinoamérica
          </h1>
          <p className="text-body-lg text-white/80 max-w-xl mx-auto">
            Compra, cotiza y gestiona tus insumos agrícolas con respaldo técnico
            y regulatorio
          </p>
        </div>

        {/* Hero search */}
        <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex shadow-lg rounded-md overflow-hidden">
            <div className="hidden sm:flex items-center border-r border-gray-200 bg-white flex-shrink-0">
              <Select defaultValue="all">
                <SelectTrigger className="border-0 rounded-none h-12 pl-3 pr-8 text-sm text-[var(--color-on-surface)] min-w-[130px] focus:ring-0 shadow-none">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="fertilizantes">Fertilizantes</SelectItem>
                  <SelectItem value="herbicidas">Herbicidas</SelectItem>
                  <SelectItem value="fungicidas">Fungicidas</SelectItem>
                  <SelectItem value="insecticidas">Insecticidas</SelectItem>
                  <SelectItem value="biologicos">Biológicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="search"
              placeholder="Buscar productos, marcas, activos…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-none border-0 h-12 text-[var(--color-on-surface)] placeholder:text-gray-400 focus-visible:ring-0 shadow-none"
            />
            <button
              type="submit"
              className="rounded-none h-12 px-5 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white flex items-center gap-1 transition-colors font-medium"
            >
              <Search className="w-5 h-5" /> Buscar
            </button>
          </div>
        </form>

        {/* Quick actions */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            {
              label: "Comprar productos",
              href: "/productos",
              icon: ShoppingBag,
            },
            {
              label: "Solicitar cotización",
              href: "/rfq/nueva",
              icon: FileText,
            },
            {
              label: "Vender aquí",
              href: "/registro/vendedor",
              icon: Building2,
            },
            {
              label: "Hablar con un experto",
              href: "/expertos",
              icon: MessageSquare,
            },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/15 hover:bg-white/25 text-white text-sm font-medium transition-colors border border-white/20"
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </div>

        <p className="text-center text-white/60 text-xs mt-5 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" />
          Disponible en Colombia, México, Brasil, Argentina y más
        </p>
      </div>

      {/* Lead capture tabs */}
      <div className="relative bg-white shadow-lg border-t border-[var(--color-border-subtle)]">
        <div className="container-max">
          <div className="flex overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  activeTab === id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
          <div className="py-5">
            {activeTab === "buy" && <BuyForm />}
            {activeTab === "sell" && <SellForm />}
            {activeTab === "rfq" && <RFQForm />}
            {activeTab === "advice" && <AdviceForm />}
          </div>
        </div>
      </div>
    </section>
  );
}

function BuyForm() {
  return (
    <form className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Producto o categoría
        </label>
        <Input placeholder="Ej: Glifosato, NPK, fungicida" className="h-9" />
      </div>
      <div className="w-40">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          País de entrega
        </label>
        <Select>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-36">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Cantidad estimada
        </label>
        <Input type="number" placeholder="Ej: 500" className="h-9" />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Email o teléfono
        </label>
        <Input placeholder="tucorreo@empresa.com" className="h-9" />
      </div>
      <button
        type="submit"
        className="h-9 px-6 rounded bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white text-sm font-medium whitespace-nowrap transition-colors"
      >
        Recibir cotizaciones
      </button>
    </form>
  );
}

function SellForm() {
  return (
    <form className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Nombre de empresa
        </label>
        <Input placeholder="Ej: AgroDistribuciones S.A." className="h-9" />
      </div>
      <div className="w-40">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          País
        </label>
        <Select>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Email de contacto
        </label>
        <Input placeholder="ventas@empresa.com" className="h-9" />
      </div>
      <Link
        href="/registro/vendedor"
        className="h-9 px-6 rounded bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white text-sm font-medium whitespace-nowrap transition-colors flex items-center"
      >
        Registrar mi empresa
      </Link>
    </form>
  );
}

function RFQForm() {
  return (
    <form className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Descripción del producto
        </label>
        <Input
          placeholder="Ej: Herbicida para maíz, ingrediente activo…"
          className="h-9"
        />
      </div>
      <div className="w-36">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Volumen requerido
        </label>
        <Input placeholder="Ej: 1000 kg" className="h-9" />
      </div>
      <div className="w-40">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          País de destino
        </label>
        <Select>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Link
        href="/rfq/nueva"
        className="h-9 px-6 rounded bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white text-sm font-medium whitespace-nowrap transition-colors flex items-center"
      >
        Enviar solicitud
      </Link>
    </form>
  );
}

function AdviceForm() {
  return (
    <form className="flex flex-wrap gap-3 items-end">
      <div className="w-44">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Cultivo
        </label>
        <Select>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            {CROPS.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Problema o consulta
        </label>
        <Input
          placeholder="Ej: Manchas amarillas en hojas, plaga de trips…"
          className="h-9"
        />
      </div>
      <div className="w-40">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          País / región
        </label>
        <Select>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c.toLowerCase()}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-medium text-[var(--color-on-surface-variant)] mb-1 block">
          Teléfono o email
        </label>
        <Input placeholder="+57 300 000 0000" className="h-9" />
      </div>
      <Link
        href="/expertos"
        className="h-9 px-6 rounded bg-[var(--color-agri-green)] hover:bg-[#1e4a1e] text-white text-sm font-medium whitespace-nowrap transition-colors flex items-center"
      >
        Solicitar asesor
      </Link>
    </form>
  );
}
