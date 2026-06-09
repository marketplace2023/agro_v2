import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_SECTIONS = [
  {
    title: "Marketplace",
    links: [
      { label: "Cómo funciona", href: "/como-funciona" },
      { label: "Ser vendedor", href: "/ser-vendedor" },
      { label: "Ser distribuidor", href: "/ser-distribuidor" },
      { label: "Planes y precios", href: "/planes" },
      { label: "Calculadora de dosis", href: "/calculadora" },
    ],
  },
  {
    title: "Categorías",
    links: [
      { label: "Fertilizantes", href: "/categorias/fertilizantes" },
      { label: "Herbicidas", href: "/categorias/herbicidas" },
      { label: "Fungicidas", href: "/categorias/fungicidas" },
      { label: "Insecticidas", href: "/categorias/insecticidas" },
      { label: "Biológicos", href: "/categorias/biologicos" },
      { label: "Ver todas", href: "/categorias" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Centro de ayuda", href: "/ayuda" },
      { label: "Asesoría agronómica", href: "/expertos" },
      { label: "Regulatorio", href: "/regulatorio" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos y condiciones", href: "/legal/terminos" },
      { label: "Política de privacidad", href: "/legal/privacidad" },
      { label: "Política de cookies", href: "/legal/cookies" },
    ],
  },
];

const SOCIAL = [
  { label: "Facebook", href: "https://facebook.com", char: "f" },
  { label: "X / Twitter", href: "https://twitter.com", char: "𝕏" },
  { label: "LinkedIn", href: "https://linkedin.com", char: "in" },
  { label: "YouTube", href: "https://youtube.com", char: "▶" },
  { label: "Instagram", href: "https://instagram.com", char: "ig" },
];

const COUNTRIES = [
  "Colombia",
  "México",
  "Brasil",
  "Argentina",
  "Perú",
  "Chile",
  "Ecuador",
  "Bolivia",
  "Venezuela",
  "Paraguay",
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-auto">
      <div className="container-max py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Marketplace
                <br />
                <span className="text-[#7dd2f1]">Agro</span>
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-xs">
              La plataforma B2B de agroinsumos más completa de Latinoamérica.
              Productos regulados, múltiples vendedores y asesoría agronómica.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ label, href, char }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xs font-bold"
                >
                  {char}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3
                className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Countries bar */}
      <div className="border-t border-white/10">
        <div className="container-max py-4">
          <p className="text-xs text-white/50 mb-2">Disponible en:</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {COUNTRIES.map((country) => (
              <Link
                key={country}
                href={`/paises/${country.toLowerCase()}`}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                {country}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="container-max py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>
            © {new Date().getFullYear()} Marketplace Agro. Todos los derechos
            reservados.
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/legal/terminos"
              className="hover:text-white transition-colors"
            >
              Términos
            </Link>
            <Link
              href="/legal/privacidad"
              className="hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/legal/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
