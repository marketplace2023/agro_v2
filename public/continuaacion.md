Read memory [](file:///c%3A/Users/username/AppData/Roaming/Code/User/workspaceStorage/52bc5752dfe6d739451851b3fe9bdf0d/GitHub.copilot-chat/memory-tool/memories/YTZmM2UwZTEtY2NlZC00Mjk4LWIzNGEtZWVmN2I3YWU3OGY0/plan.md)

El plan está completo y documentado. Aquí la presentación final:

---

## Plan: Marketplace Agro — Next.js 16 + NeonDB + Netlify

**TL;DR:** Sistema operativo agroindustrial B2B completo. Next.js 16 App Router sin backend separado (toda la API en Route Handlers), NeonDB PostgreSQL serverless, deploy Netlify. Cubre el 100% del PLAN_MASTER.md: **49 pantallas, 12 dashboards, 10 fases, 116 pasos**.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.2.7 — App Router + RSC + Route Handlers |
| UI | Tailwind v4 (ya instalado) + shadcn/ui |
| Estado | Zustand + TanStack Query + TanStack Table v8 |
| Formularios | React Hook Form + Zod |
| DB | NeonDB (PostgreSQL serverless) |
| ORM | Prisma + `@neondatabase/serverless` HTTP mode |
| Auth | Auth.js v5 — email+pass + Google + Microsoft + TOTP 2FA |
| Search | PostgreSQL FTS `pg_trgm` en NeonDB |
| Archivos | uploadthing |
| Email | Resend + React Email templates |
| WhatsApp | Meta Business API / Twilio |
| Jobs | Inngest (reemplaza BullMQ — serverless compatible) |
| Pagos | Stripe Elements + PSE / OXXO / Pix / Boleto por país |
| PDFs | `@react-pdf/renderer` |
| Mapas | Leaflet (import dinámico — sin SSR) |
| Gráficas | Recharts |
| i18n | next-intl (ES / EN / PT) |
| Monitoring | Sentry |
| Deploy | Netlify + `@netlify/plugin-nextjs` |

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── (public)/          ← portal sin auth, SSR/ISR
│   ├── (auth)/            ← login, registro — layout limpio
│   ├── (dashboard)/       ← protegido por middleware — 13 dashboards
│   ├── (admin)/           ← solo rol admin
│   ├── api/               ← Route Handlers — reemplazan NestJS
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── search/route.ts
│   │   ├── products/[id]/route.ts
│   │   ├── orders/route.ts
│   │   ├── cart/route.ts
│   │   ├── rfq/route.ts
│   │   ├── upload/route.ts
│   │   ├── refunds/route.ts
│   │   ├── webhooks/stripe/route.ts
│   │   └── webhooks/odoo/route.ts
│   ├── globals.css        ← design tokens DESIGN.md en @theme inline
│   └── layout.tsx         ← fuentes: Hanken Grotesk / Open Sans / Inter
├── components/
│   ├── ui/                ← shadcn/ui primitivos
│   ├── layout/            ← Header, Footer, CategoryNav
│   ├── products/          ← ProductCard, ProductCarousel, PriceDisplay
│   ├── search/            ← SearchBar, SearchFilters
│   ├── cart/ checkout/ rfq/ dashboard/ forms/
├── lib/
│   ├── db/prisma.ts       ← singleton NeonDB+Prisma
│   ├── auth/config.ts     ← Auth.js v5 — 12 roles
│   └── validations/       ← Zod schemas por módulo
├── store/                 ← cartStore, userStore (Zustand)
├── hooks/ types/
└── middleware.ts          ← protección rutas + roles (edge)
```

---

## Pantallas Completas — 49 rutas

**Portal Público (Sección 5)**

| Ruta | Contenido |
|---|---|
| `/` | Hero + buscador + 8 secciones (categorías, productos, B2B, cultivos, vendedores, biblioteca, leads) |
| `/buscar` | FTS panel filtros 25% + resultados 75% (tarjetas / tabla B2B) + autocompletado |
| `/categorias` | Grid con subcategorías visibles |
| `/categorias/[slug]` | Filtros específicos por familia + banner técnico |
| `/productos/[slug]` | 4 tabs (Comercial, Técnica, Regulatoria, Reseñas) + panel compra + tabla otros vendedores |
| `/vendedores/[slug]` | 4 tabs (Catálogo, Sobre nosotros, Políticas, Reputación 4 dimensiones) |
| `/paises` | Mapa Leaflet interactivo Latam + lista |
| `/paises/[pais]` | Catálogo filtrado + autoridad regulatoria + restricciones vigentes |
| `/cultivos` | Grid 16 cultivos |
| `/cultivos/[cultivo]` | 8 bloques: fenología timeline, plagas, enfermedades, fertilización, fitosanidad, expertos |
| `/problemas-agricolas` | Selector síntoma → causas + fotos referencia + productos + CTA asesor |
| `/expertos` | Directorio con filtros + disponibilidad |
| `/expertos/[slug]` | Perfil + trayectoria + calendario disponibilidad + formulario cita |
| `/biblioteca` | Filtros tipo/categoría/cultivo/idioma + cards + visor PDF integrado |
| `/blog` | Hero artículo + grid 3 col + categorías |
| `/blog/[slug]` | Contenido + sidebar (artículos relacionados + productos mencionados) |
| `/registro` | Selector 4 tipos de cuenta |
| `/registro/comprador` | 2 pasos: datos personales → perfil de uso |
| `/registro/vendedor` | 3 pasos: representante → empresa → documentos (uploadthing) |
| `/registro/fabricante` | Vendedor + líneas propias + registros sanitarios + distribuidores |
| `/login` | Email+pass + Google + Microsoft + 2FA TOTP + estados error |

**Marketplace Transaccional (Sección 6)**

| Ruta | Contenido |
|---|---|
| `/productos` | Catálogo + banner rotativo Campaign + recientes + sugerencias personalizadas |
| `/carrito` | Multi-vendedor + validación regulatoria RT + badges + resumen + cupón |
| `/rfq/nueva` | 4 pasos: info → productos+specs+docs req → vendedores sugeridos → revisión+envío |
| `/rfq/[id]/ofertas` | Tabla comparativa completa + modal negociación/contraoferta + contador cierre |
| `/checkout` | 4 pasos: dirección → Stripe+PSE/OXXO/Pix → facturación → confirmación |
| `/ordenes` | 10 tabs de estado + filtros + paginación server-side |
| `/ordenes/[id]` | Timeline + 5 tabs (Productos, Documentos PDF, Tracking+mapa, Pagos, Reclamos+chat) |

**Dashboards (Sección 7) — 12 dashboards + Almacén**

| Ruta | Dashboard |
|---|---|
| `/dashboard/comprador` | KPIs + órdenes + cotizaciones + tracking + recompra rápida + alertas |
| `/dashboard/comprador-corporativo` | Aprobaciones (prioritaria) + gasto por sede (Recharts) + crédito + contratos |
| `/dashboard/vendedor` | KPIs ventas + órdenes urgentes + RFQ recibidas + inventario alertas + liquidación |
| `/dashboard/fabricante` | Líneas por país + mapa distribuidores + registros + reclamos calidad |
| `/dashboard/distribuidor` | Territorio + productos autorizados + pedidos regionales + clientes + inventario |
| `/dashboard/asesor` | Cola consultas con fotos + formulario diagnóstico completo + planes + agenda |
| `/dashboard/logistica` | Despachos hoy + formulario despacho + tránsito mapa + incidencias + prueba entrega |
| `/dashboard/regulatorio` | Cola revisión docs (✅/⚠️/❌) + formulario aprobación + alertas |
| `/dashboard/finanzas` | Pagos confirmación + liquidaciones período + cálculo automático + retenciones |
| `/dashboard/soporte` | Cola tickets SLA + pantalla atención + acciones orden + garantías |
| `/dashboard/marketing` | Banners drag-and-drop + campañas + métricas + editor blog rich text SEO |
| `/admin` | KPIs globales + gráficas Recharts + mapa calor Leaflet + accesos rápidos |
| `/dashboard/almacen` | Inventario + lotes FIFO + picking/packing checklist por orden |

**Módulo Regulatorio (Sección 8)**

| Ruta | Contenido |
|---|---|
| `/regulatorio` | Resumen catálogo (aprobados/pendientes/alertas/bloqueados) + tabla cola |
| `/regulatorio/fur-producto/[id]` | 5 tabs: Comercial + Técnico + Regulatorio por país + Documentos versionados + Historial inmutable |

**Módulo B2B (Sección 9)**

| Ruta | Contenido |
|---|---|
| `/b2b/empresas` | Tabla empresas admin + perfil completo |
| `/b2b/cuenta-corporativa` | Usuarios + roles + sedes/fincas GPS + centros de costo % ejecutado |
| `/b2b/aprobaciones` | Reglas configurables + cola con detalle + aprobar/rechazar/ajustar |
| `/b2b/contratos` | Contrato marco + tabla productos precio/volumen + firma electrónica |
| `/b2b/credito` | Vista comprador: cupo/vencimientos / Vista analista: evaluación+score+decisión |

**Admin Global (Sección 11)**

| Ruta | Contenido |
|---|---|
| `/admin/configuracion` | 4 tabs: General / Comisiones por categoría / Regulatorio / Integraciones |
| `/admin/auditoria` | Log inmutable filtrado + detalle campo antes/después |

**Asesoría Agronómica (Sección 12)**

| Ruta | Contenido |
|---|---|
| `/asesoria-agronomica` | 3 pasos: contexto+síntomas → fotos → info adicional+urgencia → confirmación DIAG-XXXX |

---

## 10 Fases — 116 Pasos

### FASE 0 — Fundamentos *(pasos 1–14)*
**Objetivo:** Proyecto corriendo en Netlify con auth, DB y design system completo.

1. Instalar dependencias: `prisma @neondatabase/serverless next-auth@beta @auth/prisma-adapter zod react-hook-form @hookform/resolvers zustand @tanstack/react-query @tanstack/react-table recharts next-intl inngest @uploadthing/react @react-pdf/renderer leaflet`
2. shadcn/ui init + componentes base: Button, Input, Card, Badge, Table, Modal, Select, Tabs, Dialog, Dropdown
3. `prisma/schema.prisma` — 30+ entidades completas: User, UserProfile, Company, CompanyUser, Sede, CentroCosto, Product, ProductVariant, ProductPriceVolume, Brand, Category, Vendor, ProductVendor, RegulatoryRecord, Document, DocumentVersion, Order, OrderItem, Cart, CartItem, Invoice, RFQ, RFQItem, RFQOffer, RFQOfferItem, Credit, Approval, ApprovalRule, Contract, ContractItem, RecurringOrder, Tracking, TrackingEvent, Lote, Despacho, Incident, Payment, Commission, Settlement, Diagnostic, AgroKnowledge, Crop, Pest, Disease, TechnicalPlan, Ticket, TicketMessage, BlogPost, Campaign, AuditLog
4. NeonDB: `DATABASE_URL`, activar extensión `pg_trgm`, `prisma migrate dev`
5. Auth.js v5: 12 roles en JWT (comprador, comprador-corporativo, vendedor, fabricante, distribuidor, asesor, logistica, regulatorio, finanzas, soporte, marketing, admin), 2FA TOTP para admin/regulatorio/finanzas
6. `src/middleware.ts` — edge middleware: protección `(dashboard)/*`, `(admin)/*`, API privada
7. globals.css — 50 tokens de DESIGN.md en `@theme inline`: colores primary/secondary/tertiary/agri-green, tipografía headline/body/label, spacing 8px base, radios
8. `next/font/google`: Hanken Grotesk → `--font-headline`, Open Sans → `--font-body`, Inter → `--font-label`
9. next-intl: ES/EN/PT, `messages/es.json` con todas las claves
10. `netlify.toml` + `@netlify/plugin-nextjs`, env vars en Netlify UI
11. `Header`: logo + SearchBar 60% ancho + CategoryDropdown + auth state + cart icon badge
12. `Footer`: 4 columnas (sitemap, B2B links, regulación, certificaciones agro)
13. `CategoryNav`: 9 categorías con íconos + label-lg + scroll horizontal móvil
14. **Verificación:** `netlify deploy` exitoso, 12 roles hacen login, DB migrada, design tokens visibles

---

### FASE 1 — Portal Público *(pasos 15–31)*
**Objetivo:** 21 rutas del portal público funcionales y SEO-ready.

15. Seed: 9 categorías+subcategorías, 30 productos con variantes, 5 vendedores, 16 cultivos+plagas, 10 expertos, 5 blog posts, 10 documentos biblioteca — *parallel con 16*
16. Componentes: `ProductCard`, `ProductCarousel`, `CategoryGrid`, `VendorCard`, `ExpertCard`, `DocumentCard` — *parallel con 15*
17. **Home `/`**: Hero+buscador autocompletado, categorías 3×3, productos destacados 4 tabs, propuesta B2B 3 col, cultivos carrusel, vendedores grid, biblioteca preview, formularios leads 4 tabs — *parallel con 16*
18. **`/buscar`**: `GET /api/search` FTS pg_trgm, panel 25% (8 filtros), resultados 75% (tarjetas+tabla B2B), dropdown autocompletado (productos/categorías/cultivos/problemas)
19. **`/categorias` + `/categorias/[slug]`**: grid+subcategorías, filtros específicos por familia, banner técnico
20. **`/productos/[slug]`**: galería+zoom, 4 tabs, tabla precios por volumen, dosis por cultivo, tabla regulatoria por país, panel compra sticky, tabla otros vendedores, 3 secciones productos relacionados
21. **`/vendedores/[slug]`**: 4 tabs, buscador interno catálogo, calificación 4 dimensiones
22. **`/paises` + `/paises/[pais]`**: mapa Leaflet lazy, lista países, catálogo filtrado, autoridad regulatoria — *parallel con 23*
23. **`/cultivos` + `/cultivos/[cultivo]`**: grid 16, 8 bloques incluyendo fenología timeline, plagas/enfermedades expandibles, planes — *parallel con 22*
24. **`/problemas-agricolas`**: 3 selectores → causas+fotos referencia+productos+CTA
25. **`/expertos` + `/expertos/[slug]`**: filtros disponibilidad, cards, calendario semanal, formulario cita
26. **`/biblioteca`**: filtros 5 dimensiones, visor PDF integrado, descarga
27. **`/blog` + `/blog/[slug]`**: hero, sidebar productos mencionados, compartir redes
28. **`/registro/[tipo]`**: comprador 2p, vendedor 3p+uploadthing, fabricante campos extra
29. **`/login`**: OAuth, 2FA TOTP, redirect por rol, `/recuperar-contrasena`
30. **SEO**: metadata dinámica, `sitemap.xml` Route Handler, `robots.txt`, schema.org (Organization+Product+BreadcrumbList), OG, hreflang next-intl
31. **Verificación:** Lighthouse ≥85, FTS <500ms, sin hydration errors

---

### FASE 2 — Marketplace Transaccional *(pasos 32–45)*
**Objetivo:** Compra directa + RFQ B2B completos end-to-end.

32. **`/productos`**: banner rotativo Campaign, recientes session storage, sugerencias, paginación cursor-based
33. Cart store Zustand + sync DB auth + localStorage anónimo
34. **`/carrito`**: secciones por vendedor, validación RT `GET /api/cart/validate`, badges advertencia, resumen+cupón, guardar después
35. **`/rfq/nueva`**: 4 pasos, búsqueda productos, specs técnicas, docs requeridos checkboxes, vendedores sugeridos, Inngest job notificación email+WhatsApp vendedores
36. **`/rfq/[id]/ofertas`**: tabla comparativa multi-col, modal contraoferta precios editables por ítem, contador tiempo real
37. **`/checkout`**: Stripe PaymentIntent `POST /api/checkout/intent`, 4 pasos, PSE/OXXO/Pix condicional por país
38. **Stripe webhook** `POST /api/webhooks/stripe`: `payment_intent.succeeded` → Order+OrderItems, `charge.dispute` → alerta admin
39. Métodos pago por país: CO (PSE, Nequi, Efecty), MX (OXXO, SPEI), BR (Pix, Boleto)
40. **`/ordenes`**: TanStack Table, 10 tabs estado, filtros, paginación
41. **`/ordenes/[id]`**: timeline, 5 tabs, mapa Leaflet tránsito, acciones por rol+estado
42. PDFs: facturas + remisiones + certificados con `@react-pdf/renderer`
43. Email templates React Email: 8 eventos (orden, pago, despacho, entrega, RFQ, aprobación, diagnóstico, crédito)
44. WhatsApp Meta Business API: 5 eventos críticos vía Inngest jobs
45. **Verificación:** Flujo E2E completo, Stripe test mode, RFQ con negociación, PDFs generados

---

### FASE 3 — Los 12 Dashboards *(pasos 46–59)*
**Objetivo:** Cada rol con su panel operativo 100% funcional.

46. `/dashboard/comprador` — KPIs 4 cards, órdenes, cotizaciones, tracking, recompra, alertas
47. `/dashboard/comprador-corporativo` — aprobaciones prioritaria, Recharts gasto sede, crédito, contratos
48. `/dashboard/vendedor` — KPIs, órdenes urgentes acciones rápidas, RFQ plazo, inventario alertas, gráfico 30 días
49. `/dashboard/fabricante` — líneas+distribuidores+registros, mapa distribuidores, reclamos calidad
50. `/dashboard/distribuidor` — territorio, productos autorizados contrato, clientes regionales, inventario
51. `/dashboard/asesor` — cola consultas fotos expandibles, formulario diagnóstico (causa+productos catálogo+plan+visita), planes activos, agenda
52. `/dashboard/logistica` — despachos formulario completo, mapa tránsito Leaflet, incidencias, prueba entrega (firma canvas + foto)
53. `/dashboard/regulatorio` — cola docs ✅/⚠️/❌, formulario aprobación países editables, alertas activas
54. `/dashboard/finanzas` — pagos confirmación manual, tabla liquidaciones cálculo automático, formulario liquidación+comprobante
55. `/dashboard/soporte` — cola SLA colores, pantalla ticket historial completo, acciones (reenvío/devolución/reembolso/escalar)
56. `/dashboard/marketing` — banners drag-and-drop fechas, campañas cupones reglas, editor blog rich text campos SEO
57. `/admin` — KPIs globales, 4 gráficas Recharts, mapa calor países Leaflet, grid 16 accesos módulos
58. `/dashboard/almacen` — inventario SKU+ubicación, lotes FIFO, picking/packing checklist por orden
59. **Verificación:** Middleware correcto por rol, datos aislados por empresa/usuario

---

### FASE 4 — Módulo Regulatorio *(pasos 60–66)*
**Objetivo:** Ningún producto regulado publicable sin aprobación completa.

60. `/regulatorio` — resumen 5 estados + tabla filtros 5 dimensiones + botón [Revisar]
61. `/regulatorio/fur-producto/[id]` — FUR 5 tabs completos (Comercial, Técnico, Regulatorio por país expandible, Documentos versionados uploadthing, Historial inmutable)
62. Flujo aprobación: validación campos mínimos → cola analista → formulario aprobación → activar en catálogo
63. Restricciones automáticas: badges en `/carrito` y `/checkout` según `RegulatoryRecord.country`
64. Inngest daily job: scan próximos 30 días → email+WhatsApp vendedor+analista
65. `/admin/auditoria` — `AuditLog` inmutable, filtros módulo/acción/usuario/IP/fechas, detalle antes/después
66. **Verificación:** Producto sin doc bloqueado, alertas enviadas, historial trazable con IP

---

### FASE 5 — B2B Empresarial *(pasos 67–75)*
**Objetivo:** Operación corporativa multi-usuario con aprobaciones y crédito.

67. `/b2b/empresas` — tabla filtros tipo/país/estado, perfil admin completo
68. `/b2b/cuenta-corporativa` — usuarios+roles+límites, sedes/fincas GPS+cultivos+área, CC tabla %ejecutado
69. `/b2b/aprobaciones` — reglas configurables (monto/proveedor nuevo/CC>90%), cola con [Aprobar][Rechazar][Ajustar], comentario obligatorio al rechazar
70. `/b2b/contratos` — contrato marco tabla productos precio/vol mín-máx, cláusulas especiales, firma electrónica, upload PDF
71. `/b2b/credito` — cupo/usado/disponible/vencimientos (comprador), evaluación score+decisión+garantías (analista)
72. Compras recurrentes: plantillas con Inngest cron, frecuencia configurable
73. Catálogo privado: `ProductVendor.companyId` — precios y productos exclusivos por empresa
74. Reportes corporativos PDF: gasto por sede/cultivo/proveedor/período
75. **Verificación:** Empresa multi-usuario con aprobaciones, crédito bloqueado si vencido >10 días

---

### FASE 6 — Logística *(pasos 76–80)*
**Objetivo:** Trazabilidad completa despacho → entrega con prueba digital.

76. Dashboard logístico completo: formulario despacho (operador, guía, peso, docs, temperatura, instrucciones especiales), tránsito mapa Leaflet, incidencias (retraso/daño/extravío/rechazo), prueba entrega (firma canvas + foto uploadthing + cédula receptor)
77. Dashboard almacén completo: inventario bodega, lotes FIFO (fechas fab/vencimiento/certificados), picking/packing checklist con docs incluidos
78. Webhook tracking: operadores logísticos → `TrackingEvent[]` → timeline en `/ordenes/[id]`
79. Garantías: condiciones, plazos, flujo reemplazo vinculado a reclamo
80. **Verificación:** Timeline completo visible, foto+firma persistidos, incidencias resueltas

---

### FASE 7 — Módulo Financiero *(pasos 81–88)*
**Objetivo:** Ciclo financiero completo con liquidación a vendedores.

81. `/dashboard/finanzas` completo: pagos manuales por confirmar, tabla liquidaciones por período
82. Conciliación automática Stripe: `payment_intent` → `Order` → `Invoice` matching
83. Comisiones: tabla configuración `/admin/configuracion`, cálculo automático al crear `OrderItem`
84. Formulario liquidación: período, cálculo (ventas-comisión-devoluciones-retenciones), cuenta destino, comprobante uploadthing
85. Retenciones e impuestos configurable por país desde `/admin/configuracion`
86. Reembolsos: `POST /api/refunds` → Stripe refund + actualizar orden + notificar comprador
87. Cuentas por cobrar/pagar con vencimientos en dashboard
88. **Verificación:** Liquidación E2E: venta → comisión → liquidación aprobada → comprobante

---

### FASE 8 — Asesoría Agronómica *(pasos 89–96)*
**Objetivo:** Ecosistema técnico agronómico conectado al catálogo de compra.

89. DB conocimiento: `Crop`, `Pest`, `Disease`, `NutrientDeficiency` con `ProductVariant[]` recomendados
90. `/asesoria-agronomica`: 3 pasos (contexto+cultivo+etapa+síntomas checkboxes, fotos+descripción uploadthing, urgencia+historial+análisis suelo), confirmación con DIAG-XXXX y SLA
91. `/dashboard/asesor` completo: cola expandible con fotos, pantalla individual (formulario: diagnóstico+causa+productos catálogo+plan técnico+visita campo+[Enviar al comprador]), planes activos seguimiento, agenda calendario
92. Asignación automática asesor: Inngest job país+cultivo+disponibilidad al crear `Diagnostic`
93. Planes técnicos exportables PDF, vinculados a `ProductVariant.id`
94. Historial técnico: `Diagnostic[]` visible en `/dashboard/comprador`
95. Sourcing agro: `RFQ.tipo = 'sourcing'` — flujo especial para productos difíciles
96. **Verificación:** Diagnóstico → asesor asignado <5min → respuesta con productos comprables directo

---

### FASE 9 — Integración ERP/Odoo *(pasos 97–104)*
**Objetivo:** Odoo como sistema de registro contable en tiempo real.

97. `POST /api/webhooks/odoo` — stock actualizado → `ProductVendor.stock`
98. Inngest job RT: `Order` confirmada → `sale.order` en Odoo REST API, mapping campos PLAN_MASTER §15.1
99. Sync productos: `Product` aprobado → `product.template` Odoo + batch diario actualizaciones
100. Sync clientes: `User` empresa → `res.partner` Odoo
101. Facturas desde Odoo expuestas en marketplace via API → tab Documentos de `/ordenes/[id]`
102. Asientos automáticos: comisiones + liquidaciones → contabilidad Odoo
103. Tab Integraciones `/admin/configuracion`: URL+DB+credenciales Odoo, [Probar conexión], [Sincronizar ahora], estado última sync
104. **Verificación:** Orden → sale.order Odoo <5 seg, stock sincronizado cada 15 min

---

### FASE 10 — Admin Global, Seguridad y Producción *(pasos 105–116)*
**Objetivo:** Control total, OWASP, performance y lanzamiento.

105. `/admin/configuracion` 4 tabs completos: General (nombre/logo/idiomas/monedas/países), Comisiones (tabla categoría + excepciones), Regulatorio (docs obligatorios por categoría + días alerta + bloqueo auto), Integraciones (Odoo+Stripe+WhatsApp+Resend)
106. Rate limiting Netlify Edge: 100 req/min general, 5 req/min `/api/auth`, 10 req/min `/api/orders`
107. Headers seguridad `netlify.toml`: CSP, `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, HSTS
108. CSRF: Auth.js v5 incluye protección; validar `Origin` header en Route Handlers críticos
109. Sanitización: Zod en todos los endpoints, DOMPurify en campos rich text del blog
110. Playwright E2E: compra directa, RFQ, login 12 roles, registro vendedor+docs, aprobación regulatoria, checkout Stripe, diagnóstico agronómico
111. ISR: `revalidate = 3600` en `/productos/[slug]`, `/categorias/[slug]`, `/blog/[slug]`; Netlify Image CDN
112. Sentry: `NEXT_PUBLIC_SENTRY_DSN` en env, captura errores frontend + Route Handlers
113. NeonDB backups: cada 6h, retención 30 días (configurar en Neon dashboard)
114. Disaster recovery: documentar `prisma migrate deploy` rollback, Netlify deploy histórico rollback
115. **Launch beta**: dominio custom + SSL, Netlify Analytics, grupos controlados vendedores+compradores
116. **Verificación criterios Sección 16:** visitante navega sin obstáculos, buscador <500ms, checkout <30 seg, notificación orden <1 min, regulatorio bloquea sin docs, 500 usuarios concurrentes, Lighthouse ≥90, OWASP Top 10 completo

---

## Modelo de Datos — 30+ Entidades

| Grupo | Entidades |
|---|---|
| Usuarios | `User` `UserProfile` `Company` `CompanyUser` `Sede` `CentroCosto` |
| Catálogo | `Product` `ProductVariant` `ProductPriceVolume` `Brand` `Category` `Vendor` `ProductVendor` |
| Regulatorio | `RegulatoryRecord` `Document` `DocumentVersion` |
| Transacciones | `Order` `OrderItem` `Cart` `CartItem` `Invoice` |
| Cotizaciones | `RFQ` `RFQItem` `RFQOffer` `RFQOfferItem` |
| B2B | `Credit` `Approval` `ApprovalRule` `Contract` `ContractItem` `RecurringOrder` |
| Logística | `Tracking` `TrackingEvent` `Lote` `Despacho` `Incident` |
| Financiero | `Payment` `Commission` `Settlement` `Retention` |
| Asesoría | `Diagnostic` `AgroKnowledge` `Crop` `Pest` `Disease` `TechnicalPlan` |
| Soporte | `Ticket` `TicketMessage` |
| Contenido | `BlogPost` `Campaign` |
| Auditoría | `AuditLog` |

---

## Integraciones Técnicas

| Integración | Implementación |
|---|---|
| Odoo ERP | Webhooks bidireccionales + REST API. Inngest jobs para envío, Route Handler para recepción |
| Stripe | PaymentIntent + Stripe Elements (PCI) + webhook. PSE/OXXO/Pix condicional por país |
| WhatsApp | Meta Business API / Twilio. Inngest jobs por 5 eventos críticos |
| Email | Resend + React Email templates. Inngest jobs por 8 eventos |
| uploadthing | Docs regulatorios, fotos diagnóstico, logos, prueba entrega, firma digital, comprobantes |
| Leaflet | Lazy-loaded: mapa países, tracking tránsito, expertos por región |
| PostgreSQL FTS | `pg_trgm` en NeonDB — sin Elasticsearch |
| Inngest | Alertas vencimiento, asignación asesores, sync Odoo, notificaciones batch, compras recurrentes, RFQ sourcing |

---

## Archivos Críticos de Referencia

- DESIGN.md — fuente de verdad del diseño
- PLAN_MASTER.md — spec pantalla a pantalla
- `prisma/schema.prisma` — única fuente de verdad del modelo de datos
- globals.css — tokens DESIGN.md en `@theme inline`
- `src/middleware.ts` — 12 roles, protección de rutas edge
- `src/lib/auth/config.ts` — Auth.js v5 con todos los roles y callbacks
- `src/lib/db/prisma.ts` — singleton NeonDB+Prisma HTTP mode

---

## Verificación Final (Sección 16 completa)

1. `netlify deploy --prod` limpio, migrations NeonDB aplicadas
2. 12 roles hacen login y son redirigidos a su dashboard correcto
3. Compra E2E: buscar → carrito → checkout Stripe → orden → tracking → entrega con firma+foto
4. RFQ: crear → vendedor cotiza → comparar → negociar → aceptar → orden
5. Regulatorio: FUR sin doc → bloqueado; con aprobación → publicado; alerta 30 días automática
6. B2B: solicitud > monto → aprobación requerida → aprobada → orden; crédito bloqueado si vencido >10 días
7. Asesoría: diagnóstico → asesor asignado <5 min → respuesta con productos comprables
8. Odoo: orden → `sale.order` <5 seg; stock actualizado cada 15 min
9. Lighthouse ≥90 performance/SEO/a11y en home, `/buscar` y `/productos/[slug]`
10. OWASP Top 10 pasado, rate limiting activo, auditoría con IP+antes/después funcional