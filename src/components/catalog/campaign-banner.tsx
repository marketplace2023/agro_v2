"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const CAMPAIGNS = [
  { id: 1, bg: "from-[#005c72] to-[#007692]", badge: "Oferta especial", title: "Temporada de lluvias: Fungicidas hasta 20% OFF", sub: "Protege tus cultivos antes de la temporada", href: "/categorias/fungicidas", cta: "Ver fungicidas" },
  { id: 2, bg: "from-[#2B5F2B] to-[#3d8a3d]", badge: "Biológicos", title: "Nuevos bioestimulantes BioSolutions disponibles", sub: "Certificados orgánicos — para exportación a USA y Europa", href: "/categorias/biologicos", cta: "Ver biológicos" },
  { id: 3, bg: "from-[#484d94] to-[#6166ae]", badge: "B2B Corporativo", title: "Compra por volumen: hasta 22% de descuento en fertilizantes", sub: "Pedidos mínimos desde 10 sacos — precio progresivo", href: "/categorias/fertilizantes", cta: "Cotizar volumen" },
];

export function CampaignBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % CAMPAIGNS.length), 6000);
    return () => clearInterval(t);
  }, []);

  if (!visible) return null;
  const c = CAMPAIGNS[current];

  return (
    <div className={`relative bg-gradient-to-r ${c.bg} text-white rounded-xl overflow-hidden mb-6`}>
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full">{c.badge}</span>
          <h2 className="text-lg font-bold mt-2 leading-tight">{c.title}</h2>
          <p className="text-sm text-white/80 mt-1">{c.sub}</p>
          <Link href={c.href} className="inline-block mt-3 text-xs font-bold bg-white text-[var(--color-primary)] px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
            {c.cta} →
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setCurrent(i => (i - 1 + CAMPAIGNS.length) % CAMPAIGNS.length)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {CAMPAIGNS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-4" : "bg-white/40"}`} />
            ))}
          </div>
          <button onClick={() => setCurrent(i => (i + 1) % CAMPAIGNS.length)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <button onClick={() => setVisible(false)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
        <X size={12} />
      </button>
    </div>
  );
}
