import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://marketplaceagro.com";

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/buscar", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "/productos", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/categorias", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/cultivos", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/paises", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/expertos", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/biblioteca", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/problemas-agricolas", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/registro", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
];

const CATEGORY_SLUGS = [
  "fertilizantes", "biologicos", "herbicidas", "insecticidas",
  "fungicidas", "semillas", "coadyuvantes", "correctores-enmiendas", "maquinaria", "servicios",
];

const CROP_SLUGS = [
  "maiz", "cafe", "cana-de-azucar", "tomate", "papa", "banano", "aguacate",
  "arroz", "soya", "cacao", "citricos", "hortalizas", "pastos", "platano", "trigo", "frutales",
];

const COUNTRY_CODES = ["co", "ve", "ec", "mx", "pe", "br", "ar", "cl", "bo", "gt"];

const BLOG_SLUGS = [
  "tendencias-biologicos-2025",
  "gestion-resistencia-herbicidas",
  "credito-b2b-agro-colombia",
  "fertilizacion-precision-cafe",
  "logistica-agroquimicos-latam",
  "innovacion-drones-agricolas",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/categorias/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const cropEntries: MetadataRoute.Sitemap = CROP_SLUGS.map((slug) => ({
    url: `${BASE_URL}/cultivos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const countryEntries: MetadataRoute.Sitemap = COUNTRY_CODES.map((code) => ({
    url: `${BASE_URL}/paises/${code}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...cropEntries,
    ...countryEntries,
    ...blogEntries,
  ];
}
