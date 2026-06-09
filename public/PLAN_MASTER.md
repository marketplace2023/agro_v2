# PLAN MAESTRO DE DESARROLLO — MARKETPLACE AGRO
## Sistema Operativo Agroindustrial Integral

**Versión:** 2.0  
**Fecha:** Junio 2026  
**Tipo:** Documento rector de diseño y desarrollo  
**Alcance:** Marketplace transaccional + Ecosistema técnico agro + Catálogo regulatorio + Operación B2B  

---

## ÍNDICE GENERAL

1. [Visión del Proyecto](#1-visión-del-proyecto)
2. [Stack Tecnológico Recomendado](#2-stack-tecnológico-recomendado)
3. [Plan de Desarrollo por Fases](#3-plan-de-desarrollo-por-fases)
4. [Arquitectura de la Plataforma](#4-arquitectura-de-la-plataforma)
5. [PORTAL PÚBLICO — Pantallas y diseño](#5-portal-público)
   - 5.1 Inicio `/`
   - 5.2 Buscador `/buscar`
   - 5.3 Categorías `/categorias`
   - 5.4 Detalle de producto `/productos/{slug}`
   - 5.5 Tienda del vendedor `/vendedores/{slug}`
   - 5.6 Productos por país `/paises`
   - 5.7 Cultivos `/cultivos` y `/cultivos/{cultivo}`
   - 5.8 Problemas agrícolas `/problemas-agricolas`
   - 5.9 Expertos regionales `/expertos`
   - 5.10 Biblioteca técnica `/biblioteca`
   - 5.11 Blog / Noticias `/blog`
   - 5.12 Registro `/registro`
   - 5.13 Login `/login`
6. [MARKETPLACE TRANSACCIONAL — Pantallas y diseño](#6-marketplace-transaccional)
   - 6.1 Catálogo comercial `/productos`
   - 6.2 Carrito B2B `/carrito`
   - 6.3 RFQ Nueva `/rfq/nueva`
   - 6.4 Comparación de ofertas `/rfq/{id}/ofertas`
   - 6.5 Checkout B2B `/checkout`
   - 6.6 Órdenes `/ordenes`
   - 6.7 Detalle de orden `/ordenes/{id}`
7. [DASHBOARDS DE USUARIO — Por rol](#7-dashboards-de-usuario)
   - 7.1 Dashboard Comprador Agro
   - 7.2 Dashboard Comprador Corporativo
   - 7.3 Dashboard Vendedor
   - 7.4 Dashboard Fabricante
   - 7.5 Dashboard Distribuidor
   - 7.6 Dashboard Asesor Agronómico
   - 7.7 Dashboard Operador Logístico
   - 7.8 Dashboard Analista Regulatorio
   - 7.9 Dashboard Analista Financiero
   - 7.10 Dashboard Atención al Cliente
   - 7.11 Dashboard Marketing
8. [MÓDULO REGULATORIO — Pantallas y diseño](#8-módulo-regulatorio)
   - 8.1 Centro regulatorio `/regulatorio`
   - 8.2 FUR Producto `/regulatorio/fur-producto/{id}`
   - 8.3 Documentos regulatorios
9. [MÓDULO B2B EMPRESARIAL — Pantallas y diseño](#9-módulo-b2b-empresarial)
   - 9.1 Empresas `/b2b/empresas`
   - 9.2 Cuenta corporativa `/b2b/cuenta-corporativa`
   - 9.3 Aprobaciones `/b2b/aprobaciones`
   - 9.4 Contratos marco `/b2b/contratos`
   - 9.5 Crédito B2B `/b2b/credito`
10. [MÓDULO LOGÍSTICO — Pantallas y diseño](#10-módulo-logístico)
11. [ADMINISTRACIÓN GLOBAL — Pantallas y diseño](#11-administración-global)
    - 11.1 Panel de admin `/admin`
    - 11.2 Configuración del marketplace
    - 11.3 Auditoría y reportes
12. [ASESORÍA AGRONÓMICA — Pantallas y diseño](#12-asesoría-agronómica)
13. [Flujos de Proceso Detallados](#13-flujos-de-proceso-detallados)
14. [Modelo de Datos — Entidades principales](#14-modelo-de-datos)
15. [Integraciones Técnicas](#15-integraciones-técnicas)
16. [Criterios de Aceptación por Módulo](#16-criterios-de-aceptación)

---

# 1. VISIÓN DEL PROYECTO

El Marketplace Agro no es una tienda en línea convencional. Es un **sistema operativo comercial agroindustrial** que integra en una sola plataforma digital:

- Compra y venta de agroinsumos regulados entre múltiples vendedores y compradores.
- Cotización por volumen (RFQ) con comparación de ofertas y negociación B2B.
- Control regulatorio estricto: ningún producto se vende sin registro vigente por país.
- Asesoría agronómica técnica conectada directamente al flujo comercial.
- Operación empresarial compleja: empresas con usuarios, sedes, centros de costo, contratos y crédito.
- Logística integrada con tracking, prueba de entrega y gestión de incidencias.
- Integración nativa con ERP/Odoo para productos, clientes, ventas, inventario y facturación.

### Usuarios objetivo primarios

| Perfil | Descripción |
|---|---|
| Comprador agro | Agricultor, finca o agrónomo independiente que compra insumos. |
| Comprador corporativo | Empresa agroindustrial con múltiples usuarios, fincas y centros de costo. |
| Vendedor / proveedor | Distribuidor o tienda que publica y vende productos agro. |
| Fabricante / marca | Empresa que produce los agroinsumos y controla su distribución. |
| Asesor agronómico | Especialista técnico que emite diagnósticos y planes. |
| Analista regulatorio | Responsable de validar documentos y aprobar publicaciones. |
| Administrador | Operador del marketplace con control global. |

---

# 2. STACK TECNOLÓGICO RECOMENDADO

## Frontend

| Componente | Tecnología sugerida | Justificación |
|---|---|---|
| Framework principal | Next.js 14+ (App Router) | SSR/SSG para SEO en portal público, RSC para dashboards. |
| UI components | Tailwind CSS + shadcn/ui | Sistema de diseño consistente, accesible y rápido. |
| Estado global | Zustand o Redux Toolkit | Gestión de carrito, sesión, notificaciones y preferencias. |
| Formularios | React Hook Form + Zod | Validación tipada en cliente, esencial para formularios complejos B2B. |
| Tablas / grids | TanStack Table v8 | Tablas con filtros, ordenamiento y paginación server-side. |
| Gráficas | Recharts o Tremor | Dashboards financieros y de rendimiento. |
| Mapas | Leaflet o Mapbox GL | Geolocalización de vendedores, rutas logísticas. |
| Upload de archivos | React Dropzone + S3 | Subida de documentos regulatorios, fotos de diagnóstico. |
| Internacionalización | next-intl | Multi-idioma para operación en Latinoamérica. |

## Backend

| Componente | Tecnología sugerida | Justificación |
|---|---|---|
| API principal | Node.js + NestJS | Arquitectura modular, soporte nativo de inyección de dependencias. |
| Base de datos | PostgreSQL + Prisma ORM | Relacional, robusto para operaciones B2B complejas. |
| Búsqueda | Elasticsearch o Typesense | Búsqueda semántica de productos con filtros agro. |
| Cola de trabajos | BullMQ + Redis | Notificaciones, emails, sincronización con Odoo. |
| Autenticación | NextAuth.js / JWT + OAuth2 | Multi-rol, SSO empresarial, 2FA para administradores. |
| Almacenamiento | AWS S3 o Cloudflare R2 | Documentos regulatorios, imágenes de productos. |
| CDN | Cloudflare | Imágenes, documentos PDF y assets estáticos. |
| Pagos | Stripe + pasarelas locales | Pagos internacionales + adaptación por país (PSE, OXXO, etc.). |
| Email | Resend o SendGrid | Notificaciones transaccionales y campañas. |
| WhatsApp | Twilio o Meta Business API | Notificaciones de órdenes y asesoría. |

## ERP / Integración

| Componente | Detalle |
|---|---|
| ERP | Odoo 17 Community / Enterprise |
| Sincronización | Webhooks bidireccionales + API REST de Odoo |
| Entidades sincronizadas | Productos, clientes, ventas, inventario, facturas, contabilidad |
| Frecuencia | Tiempo real para órdenes y stock; batch diario para catálogo |

## Infraestructura

| Componente | Tecnología sugerida |
|---|---|
| Hosting frontend | Vercel o AWS Amplify |
| Hosting backend | AWS ECS / Railway / Render |
| Base de datos | AWS RDS PostgreSQL o Supabase |
| Monitoring | Datadog o Sentry |
| CI/CD | GitHub Actions |

---

# 3. PLAN DE DESARROLLO POR FASES

## Fase 0 — Fundamentos (Semanas 1–3)

**Objetivo:** Infraestructura base, autenticación y modelo de datos inicial.

| Tarea | Descripción |
|---|---|
| Setup del monorepo | Next.js + NestJS en turborepo o nx |
| Base de datos | PostgreSQL + Prisma schema inicial (usuarios, empresas, productos, órdenes) |
| Autenticación | Login/registro, roles, JWT, refresh tokens |
| Sistema de roles | Middleware de permisos por ruta y por recurso |
| Diseño base | Design tokens, componentes base (botones, inputs, cards, tablas, modales) |
| CI/CD | Pipeline de testing y deploy automático |
| Variables de entorno | Por ambiente: dev, staging, producción |

**Entregables:** Proyecto corriendo localmente con login/registro funcional y modelo de datos inicial.

---

## Fase 1 — Portal público y catálogo (Semanas 4–8)

**Objetivo:** El marketplace es navegable públicamente con productos reales.

| Tarea | Descripción |
|---|---|
| Página de inicio | Hero, categorías, productos destacados, CTA |
| Buscador | Elasticsearch/Typesense con filtros agro |
| Catálogo de productos | Listado con filtros, ordenamiento y paginación |
| Detalle de producto | Info comercial + técnica + regulatoria |
| Tienda del vendedor | Perfil público de la tienda |
| Páginas de categorías | Una por familia de productos |
| Cultivos y problemas agrícolas | Páginas informativas SEO-optimizadas |
| Biblioteca técnica | Upload y gestión de documentos públicos |
| Blog | CMS básico (o integración con Contentful/Sanity) |
| SEO técnico | Metadatos, sitemap, schema.org, OpenGraph |

**Entregables:** Portal público navegable, indexable por buscadores.

---

## Fase 2 — Marketplace transaccional (Semanas 9–15)

**Objetivo:** Compras directas y cotizaciones B2B funcionando.

| Tarea | Descripción |
|---|---|
| Carrito B2B | Multi-vendedor, validación regulatoria, cálculo de flete |
| Checkout | Dirección, pago, crédito, facturación |
| Pasarela de pagos | Stripe + integraciones locales |
| Gestión de órdenes | Estados, historial, acciones por rol |
| RFQ completo | Creación, respuesta de vendedores, comparación, negociación |
| Facturación básica | Generación de facturas PDF |
| Notificaciones | Email + WhatsApp por eventos de orden |
| Dashboard comprador | Vista de órdenes, pagos, cotizaciones |
| Dashboard vendedor | Productos, órdenes recibidas, cotizaciones |

**Entregables:** Flujo completo de compra directa y RFQ entre compradores y vendedores.

---

## Fase 3 — Módulo regulatorio (Semanas 16–20)

**Objetivo:** Control total de productos regulados antes de publicar o vender.

| Tarea | Descripción |
|---|---|
| FUR Producto | Ficha única maestra con datos técnicos, regulatorios y logísticos |
| Gestión de documentos | Upload versionado de fichas, SDS, etiquetas, certificados |
| Registros por país | Estado regulatorio por mercado |
| Flujo de aprobación | Vendedor carga → Analista revisa → Aprueba/rechaza |
| Restricciones de uso | Bloqueo por país, cultivo o tipo de comprador |
| Alertas regulatorias | Vencimientos automáticos con notificaciones |
| Auditoría documental | Historial de cambios trazado por usuario y fecha |
| Dashboard regulatorio | Cola de revisión, estados, alertas activas |

**Entregables:** Ningún producto regulado se puede publicar sin aprobación completa.

---

## Fase 4 — Operación B2B empresarial (Semanas 21–27)

**Objetivo:** Soporte para empresas compradoras con operaciones complejas.

| Tarea | Descripción |
|---|---|
| Cuenta corporativa | Empresa, usuarios internos, roles, sedes, fincas |
| Centros de costo | Asignación de compras por área o proyecto |
| Flujo de aprobaciones | Reglas por monto, producto, proveedor, centro de costo |
| Contratos marco | Precios y condiciones pactadas entre empresa y vendedor |
| Crédito B2B | Solicitud, evaluación, cupo, vencimientos, cobranza |
| Compras recurrentes | Plantillas de pedido, frecuencia automática |
| Catálogo privado por cliente | Productos y precios exclusivos por empresa |
| Reportes corporativos | Por sede, cultivo, proveedor, período |
| Dashboard corporativo | Vista ejecutiva de gasto, aprobaciones, crédito |

**Entregables:** Empresa compradora puede operar con múltiples usuarios, aprobaciones y crédito.

---

## Fase 5 — Ecosistema técnico y asesoría (Semanas 28–33)

**Objetivo:** El marketplace es también una herramienta técnica agronómica.

| Tarea | Descripción |
|---|---|
| Base de conocimiento agro | Cultivos, plagas, enfermedades con productos recomendados |
| Asesoría agronómica | Solicitud de diagnóstico con fotos y ubicación |
| Asignación de asesores | Por país, cultivo y disponibilidad |
| Planes técnicos | Fertilización y fitosanidad vinculados a productos del catálogo |
| Expertos regionales | Perfil público, agenda y contacto |
| Historial técnico | Casos resueltos por comprador, cultivo y problema |
| Sourcing agro | RFQ especial para productos difíciles de conseguir |
| Dashboard asesor | Cola de consultas, diagnósticos, planes activos |

**Entregables:** Comprador puede solicitar diagnóstico y recibir recomendación con productos comprables.

---

## Fase 6 — Logística y posventa (Semanas 34–38)

**Objetivo:** Trazabilidad completa de entregas, reclamos y devoluciones.

| Tarea | Descripción |
|---|---|
| Módulo de despacho | Preparación, guías, asignación de transportista |
| Tracking en tiempo real | Integración con operadores logísticos |
| Prueba de entrega | Foto + firma digital + geolocalización |
| Gestión de incidencias | Retraso, daño, extravío |
| Reclamos y devoluciones | Flujo completo con evidencias y resolución |
| Garantías | Condiciones, plazos y reemplazo |
| Dashboard logístico | Despachos, rutas activas, incidencias |
| Dashboard almacén | Lotes, picking, packing, vencimientos |

**Entregables:** Trazabilidad completa desde despacho hasta entrega confirmada.

---

## Fase 7 — Financiero, comisiones y liquidaciones (Semanas 39–43)

**Objetivo:** Control total de dinero en la plataforma.

| Tarea | Descripción |
|---|---|
| Conciliación de pagos | Matching automático pago → orden → factura |
| Comisiones del marketplace | Cálculo por categoría, vendedor o tipo de venta |
| Liquidaciones a vendedores | Programación, cálculo, aprobación y transferencia |
| Retenciones e impuestos | Por país y tipo de producto |
| Reembolsos | Flujo completo vinculado a reclamo o devolución |
| Cuentas por cobrar / pagar | Panel de deuda y vencimientos |
| Dashboard financiero | Pagos, facturas, conciliaciones, comisiones |
| Dashboard crédito | Cupos, mora, cobranza, garantías |

**Entregables:** Ciclo financiero completo con liquidación a vendedores.

---

## Fase 8 — Integración ERP/Odoo (Semanas 44–48)

**Objetivo:** Odoo como sistema de registro contable y operativo.

| Tarea | Descripción |
|---|---|
| Sincronización de productos | Marketplace → Odoo en tiempo real |
| Sincronización de clientes | Compradores como contactos en Odoo |
| Órdenes de venta | Cada orden genera venta en Odoo |
| Facturación | Facturas generadas en Odoo, expuestas en Marketplace |
| Inventario | Stock sincronizado bidireccional |
| Contabilidad | Comisiones, liquidaciones y asientos automáticos |
| ERP para B2B | Crédito, contratos y reportes desde Odoo |

**Entregables:** Odoo operando como ERP central con datos del marketplace en tiempo real.

---

## Fase 9 — Administración, auditoría y producción (Semanas 49–54)

**Objetivo:** Control operativo global, hardening y lanzamiento.

| Tarea | Descripción |
|---|---|
| Panel de administración global | Dashboard admin completo |
| Configuración del marketplace | Comisiones, países, monedas, impuestos, políticas |
| Auditoría | Log de todas las acciones críticas con usuario, fecha y cambio |
| Marketing y SEO avanzado | Banners, campañas, newsletter |
| Soporte y tickets | Sistema de atención al cliente integrado |
| Performance y seguridad | Rate limiting, WAF, OWASP checklist |
| Testing end-to-end | Playwright para flujos críticos |
| Plan de disaster recovery | Backups, failover, rollback |
| Lanzamiento beta | Grupos controlados de vendedores y compradores |

**Entregables:** Plataforma en producción con monitoreo, auditoría y soporte activo.

---

# 4. ARQUITECTURA DE LA PLATAFORMA

```
┌─────────────────────────────────────────────────────────────────┐
│                     MARKETPLACE AGRO                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Portal        │  │ Dashboards   │  │ Admin / Backoffice │   │
│  │ Público       │  │ por Rol      │  │ /admin             │   │
│  │ (Next.js SSR) │  │ (Next.js CSR)│  │ (Next.js CSR)      │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘   │
│         │                  │                    │               │
│         └──────────────────┼────────────────────┘               │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │  API Gateway     │                           │
│                   │  (NestJS / REST) │                           │
│                   └────────┬────────┘                           │
│                            │                                     │
│    ┌───────────┬───────────┼───────────┬──────────────┐        │
│    │           │           │           │              │        │
│  ┌─▼──┐  ┌────▼──┐  ┌────▼──┐  ┌────▼──┐  ┌────────▼─┐     │
│  │Auth│  │Catalog│  │Orders │  │Regul. │  │B2B/Credit│     │
│  │Svc │  │Svc    │  │Svc    │  │Svc    │  │Svc       │     │
│  └────┘  └───────┘  └───────┘  └───────┘  └──────────┘     │
│                            │                                     │
│    ┌───────────┬───────────┼───────────┬──────────────┐        │
│    │           │           │           │              │        │
│  ┌─▼──┐  ┌────▼──┐  ┌────▼──┐  ┌────▼──┐  ┌────────▼─┐     │
│  │PG  │  │Elastic│  │Redis  │  │S3/R2  │  │BullMQ    │     │
│  │DB  │  │search │  │Cache  │  │Files  │  │Jobs      │     │
│  └────┘  └───────┘  └───────┘  └───────┘  └──────────┘     │
│                            │                                     │
│              ┌─────────────┼─────────────┐                      │
│              │             │             │                       │
│         ┌────▼──┐  ┌───────▼─┐  ┌──────▼──┐                   │
│         │ Odoo  │  │Stripe / │  │WhatsApp │                   │
│         │ ERP   │  │Payments │  │/ Email  │                   │
│         └───────┘  └─────────┘  └─────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

---

# 5. PORTAL PÚBLICO

## 5.1 Inicio `/`

**Propósito:** Presentar el marketplace como plataforma agroindustrial integral. Primera impresión para compradores, vendedores y visitantes. Punto de entrada al funnel.

**Tipo de acceso:** Público (sin login)  
**SEO:** Página principal — title, description, Open Graph, schema.org Organization

---

### Sección 1 — Hero principal

**Layout:** Full-width con fondo de imagen o video agro. Texto centrado con CTA.

**Contenido visible:**
- Título principal: "El marketplace de agroinsumos para Latinoamérica"
- Subtítulo: "Compra, cotiza y gestiona tus insumos agrícolas con respaldo técnico y regulatorio"
- **Buscador central** (ver detalle en 5.2)
- 4 botones de acción rápida:
  - `Comprar productos` → `/productos`
  - `Solicitar cotización` → `/rfq/nueva`
  - `Vender en el marketplace` → `/registro/vendedor`
  - `Hablar con un experto` → `/expertos`

**Comportamiento:**
- Buscador con autocompletado (productos, categorías, cultivos)
- Cambio de país detectado automáticamente (geolocalización IP)
- Si el usuario está autenticado, el hero muestra "Bienvenido, [nombre]" con acceso directo al dashboard

---

### Sección 2 — Categorías principales

**Layout:** Grid de 3×3 o carrusel horizontal en móvil

**Categorías mostradas (con ícono y número de productos):**
1. Fertilizantes
2. Biológicos
3. Herbicidas
4. Insecticidas
5. Fungicidas
6. Semillas
7. Coadyuvantes
8. Maquinaria
9. Servicios agrícolas

**Comportamiento:** Clic → `/categorias/{slug}`

---

### Sección 3 — Productos destacados

**Layout:** Carrusel horizontal con 4 tarjetas visibles (scroll en móvil)

**Tabs de selección:**
- Más vendidos
- Nuevos productos
- En promoción
- Por temporada

**Tarjeta de producto (card):**
```
┌────────────────────────────┐
│ [Imagen del producto]      │
│ [Badge: Regulado | Nuevo]  │
├────────────────────────────┤
│ Nombre del producto        │
│ Fabricante / Marca         │
│ Categoría                  │
│ ⭐ 4.8 (132 reseñas)       │
│                            │
│ Precio base desde:         │
│ $45.00 / Lt                │
│                            │
│ [Agregar al carrito] [RFQ] │
└────────────────────────────┘
```

**Datos en cada tarjeta:** imagen, nombre, marca, categoría, calificación, precio desde, disponibilidad, botones de acción.

---

### Sección 4 — Propuesta de valor B2B

**Layout:** 3 columnas con íconos grandes y descripciones

**Columnas:**
- Compra directa: "Más de 5,000 productos regulados disponibles"
- Cotización por volumen: "Solicita RFQ a múltiples vendedores y compara ofertas"
- Crédito comprador: "Financiamiento hasta 90 días para empresas calificadas"

---

### Sección 5 — Ecosistema agro (navegación por cultivo)

**Layout:** Carrusel de cultivos con imagen y texto

**Cultivos destacados:** Maíz, Café, Caña de azúcar, Tomate, Papa, Banano, Aguacate

**Acción:** Clic → `/cultivos/{cultivo}`

---

### Sección 6 — Vendedores destacados

**Layout:** Grid de logos de fabricantes y distribuidores

**Contenido:** Logo, nombre, país, número de productos, rating

**Acción:** Clic → `/vendedores/{slug}`

---

### Sección 7 — Biblioteca técnica (preview)

**Layout:** 3 cards de documentos recientes

**Tipos:** Ficha técnica, Guía de aplicación, Noticia agro

**CTA:** "Ver biblioteca completa" → `/biblioteca`

---

### Sección 8 — Formularios rápidos (leads)

**Layout:** Tabs con 4 formularios

**Tab 1 — Quiero comprar:**
- Campo: Producto o categoría (autocomplete)
- Campo: País de entrega (select)
- Campo: Cantidad estimada (number)
- Campo: Email o teléfono (input)
- Botón: "Recibir cotizaciones"

**Tab 2 — Quiero vender:**
- Campo: Nombre de empresa (input)
- Campo: País (select)
- Campo: Categorías que maneja (multi-select)
- Campo: Email de contacto (input)
- Botón: "Registrar mi empresa"

**Tab 3 — Quiero cotizar:**
- Campo: Descripción del producto (textarea)
- Campo: Volumen requerido (input)
- Campo: País de destino (select)
- Campo: Fecha requerida (date)
- Botón: "Enviar solicitud de cotización"

**Tab 4 — Quiero asesoría técnica:**
- Campo: Cultivo (select)
- Campo: Problema o consulta (textarea)
- Campo: País / región (select)
- Campo: Teléfono o email (input)
- Botón: "Solicitar asesor"

---

### SEO y metadatos

```
<title>Marketplace Agro — Compra y venta de agroinsumos regulados en Latinoamérica</title>
<meta name="description" content="Plataforma B2B para compra, venta y cotización de fertilizantes, biológicos, herbicidas, fungicidas e insecticidas. Múltiples vendedores, productos regulados y asesoría agronómica." />
```

**Schema.org:** `Organization`, `WebSite`, `SearchAction`

---

## 5.2 Buscador `/buscar`

**Propósito:** Permitir el descubrimiento de productos por múltiples criterios agro. Es la principal herramienta de navegación del marketplace.

**Tipo de acceso:** Público  
**Motor:** Elasticsearch o Typesense con índice de productos, categorías y cultivos

---

### Layout general

**Columna izquierda (25%) — Panel de filtros:**

```
FILTROS
─────────────────
País
[ ] Colombia
[ ] Venezuela
[ ] Ecuador
[ ] México
[ ] Perú
[ ] Brasil
[+ 9 más]

Categoría
[ ] Fertilizantes (234)
[ ] Herbicidas (187)
[ ] Fungicidas (156)
[ ] Biológicos (98)
[+ 5 más]

Cultivo
[ ] Maíz (312)
[ ] Café (256)
[ ] Tomate (198)
[+ 14 más]

Ingrediente activo
[___________________]

Fabricante / Marca
[___________________]

Precio
Desde [$____] Hasta [$____]

Disponibilidad
[x] Solo disponibles

Regulación
[ ] Con registro vigente
[ ] Aprobado por organismo

Tipo de producto
[ ] Regulado
[ ] No regulado
[ ] Biológico certificado

[Limpiar filtros]
```

**Columna derecha (75%) — Resultados:**

**Barra superior:**
- Input de búsqueda con autocompletado
- Ordenar por: Relevancia | Precio ↑↓ | Disponibilidad | Calificación
- Vista: ⊞ Tarjetas | ≡ Tabla B2B
- Resultados encontrados: "842 productos"

**Vista tabla B2B (para compradores que prefieren ver muchos productos rápido):**

| Producto | Marca | Categoría | País | Precio/unidad | Stock | Vendedor | Reg. | Acción |
|---|---|---|---|---|---|---|---|---|
| Glifosato 480 SL | AgroMax | Herbicida | CO/VE | $12.50/Lt | Disponible | DistAg | ✓ | [Cotizar] [Comprar] |

**Vista tarjetas:** Grid de 2–3 columnas con la tarjeta de producto descrita en la sección 5.1.

---

### Autocompletado del buscador

Al escribir, el dropdown muestra:

```
🔍 "maíz fertilizante"
────────────────────────
Productos (5)
  • Urea 46% Granulada — Fertilizante nitrogenado
  • NPK 15-15-15 — Fertilizante complejo
  • Sulfato de amonio — Nitrogenado
Categorías (2)
  • Fertilizantes nitrogenados
  • Fertilizantes para maíz
Cultivos (1)
  • Maíz — Ver productos recomendados
Problemas (1)
  • Deficiencia de nitrógeno en maíz
```

---

### Página de resultados sin búsqueda (`/buscar`)

Muestra:
- Categorías populares
- Búsquedas recientes del usuario (si está autenticado)
- Productos tendencia esta semana
- Cultivos populares en su país

---

## 5.3 Categorías `/categorias` y `/categorias/{slug}`

**Propósito:** Navegar el catálogo organizado por familia de productos.

**Tipo de acceso:** Público

---

### Página raíz `/categorias`

**Layout:** Grid de categorías principales con imagen, nombre y contador de productos.

**Categorías principales con subcategorías visibles:**

```
Fertilizantes (420 productos)
  → Nitrogenados → Fosfatados → Potásicos → NPK → Solubles → Micronutrientes

Biológicos (98 productos)
  → Biofertilizantes → Bioestimulantes → Biopesticidas → Microorganismos

Protección de cultivos (501 productos)
  → Herbicidas → Insecticidas → Fungicidas → Acaricidas → Nematicidas

Semillas (134 productos)
  → Hortalizas → Cereales → Forrajes → Frutales

Coadyuvantes (67 productos)
  → Adherentes → Humectantes → Reguladores pH

Correctores y enmiendas (89 productos)
  → Correctores de suelo → Enmiendas orgánicas

Maquinaria y equipos (212 productos)
  → Riego → Fumigación → Bombas → Herramientas

Servicios agrícolas (45 servicios)
  → Asesoría técnica → Análisis de suelo → Drones
```

---

### Página de subcategoría `/categorias/{slug}`

**Layout:** Misma estructura del buscador con filtros predefinidos para esa categoría.

**Filtros adicionales específicos por categoría:**

Para Herbicidas:
- Tipo de maleza objetivo (hoja ancha, gramíneas, ciperáceas)
- Modo de acción (sistémico, contacto, preemergente)
- Cultivos autorizados (multi-select)

Para Fertilizantes:
- Tipo de nutriente (nitrógeno, fósforo, potasio, micronutrientes)
- Forma (sólido, líquido, soluble, granulado)
- Método de aplicación (foliar, drench, fertirrigación, suelo)

**Banner informativo de la categoría:**
- Título y descripción técnica breve de la familia de productos
- Link a "Guía de uso de [categoría]" en biblioteca técnica
- CTA: "¿Necesitas asesoría? Habla con un experto"

---

## 5.4 Detalle de Producto `/productos/{slug}`

**Propósito:** Página central del producto. Integra información comercial, técnica y regulatoria en una sola vista.

**Tipo de acceso:** Público para ver; requiere cuenta para comprar o cotizar.

---

### Layout de la página

**Columna izquierda (55%) — Información principal:**

**Bloque 1 — Cabecera del producto:**
- Galería de imágenes (principal + miniaturas, zoom)
- Nombre completo del producto
- Nombre técnico / ingrediente activo
- Marca y fabricante (con link a su tienda/perfil)
- Categoría y subcategoría (breadcrumb)
- Badges: [Regulado] [Orgánico] [Disponible en tu país]
- Calificación: ⭐ 4.7 (234 reseñas)

**Bloque 2 — Tabs de información:**

**Tab Comercial (visible por defecto):**
- Presentaciones disponibles: 1L, 5L, 20L, 200L (selector)
- Precio por presentación seleccionada
- Tabla de precios por volumen:
  ```
  Cantidad   Precio/unidad   Descuento
  1–9           $45.00         —
  10–49         $41.00        -9%
  50–99         $38.50       -14%
  100+          $35.00       -22%
  ```
- Stock disponible
- Países disponibles
- Vendedores que ofrecen este producto (lista con precio y rating)
- Condiciones de entrega del vendedor

**Tab Información técnica:**
- Composición / Ingrediente activo + concentración
- Formulación (emulsión concentrada, polvo mojable, gránulos, etc.)
- Modo de acción
- Cultivos de uso registrado
- Plagas / enfermedades / malezas objetivo
- Dosis recomendada por cultivo (tabla)
- Métodos de aplicación (foliar, drench, drip)
- Compatibilidad con otros productos
- Período de carencia
- Intervalo de reentrada

**Tab Documentos regulatorios:**
- Estado regulatorio por país (tabla):
  ```
  País        Autoridad    Número reg.    Vigencia    Estado
  Colombia    ICA          PA-XXXX-XX     31/12/2026  ✅ Vigente
  Venezuela   SASA         VE-XXX-XX      15/06/2026  ⚠️ Por vencer
  México      SENASICA     REG-XXXX       31/12/2025  ✅ Vigente
  ```
- Documentos descargables:
  - [📄 Ficha técnica PDF]
  - [📄 Hoja de seguridad SDS]
  - [📄 Etiqueta autorizada]
  - [📄 Certificado de calidad]
- Restricciones de uso (si aplica)
- Alertas regulatorias activas

**Tab Reseñas y preguntas:**
- Calificación general (barras por estrella)
- Listado de reseñas con: comprador, cultivo, fecha, texto, calificación
- Formulario para agregar reseña (solo compradores que compraron el producto)
- Preguntas frecuentes respondidas por el vendedor o asesor

---

**Columna derecha (45%) — Panel de compra:**

```
┌──────────────────────────────┐
│  Precio                       │
│  $45.00 / Lt                  │
│  (Precio con IVA incluido)    │
├──────────────────────────────┤
│  Vendedor: DistAgroMax        │
│  ⭐ 4.9  |  98% cumplimiento │
│  Entrega en 3–5 días         │
├──────────────────────────────┤
│  Presentación: [5 Lt    ▼]   │
│  Cantidad:  [-] [1] [+]      │
│  Subtotal: $45.00             │
├──────────────────────────────┤
│  País de entrega:             │
│  [Colombia              ▼]   │
│  Stock: Disponible ✓          │
├──────────────────────────────┤
│  [  AGREGAR AL CARRITO  ]    │
│  [  COMPRAR AHORA       ]    │
│  [  SOLICITAR COTIZACIÓN]    │
├──────────────────────────────┤
│  ♡ Agregar a favoritos       │
│  📤 Compartir                 │
│  📊 Comparar con otro        │
├──────────────────────────────┤
│  ❓ Consultar al vendedor     │
│  🌱 Solicitar asesoría técnica│
│  📄 Descargar ficha técnica  │
└──────────────────────────────┘
```

**Bloque inferior — Otros vendedores para este producto:**

| Vendedor | País | Precio | Stock | Entrega | Acción |
|---|---|---|---|---|---|
| DistAgro | CO | $43.00 | Disp. | 2 días | [Ver oferta] |
| AgroSup | VE | $46.50 | Disp. | 5 días | [Ver oferta] |

---

**Sección inferior — Productos relacionados:**
- "Productos frecuentemente comprados juntos" (3 productos)
- "Productos del mismo fabricante" (carrusel)
- "También te puede interesar" (por cultivo y categoría)

---

## 5.5 Tienda del Vendedor `/vendedores/{slug}`

**Propósito:** Perfil público del vendedor con catálogo, reputación y condiciones.

**Tipo de acceso:** Público

---

### Layout

**Header de la tienda:**
```
[Logo]  Nombre del vendedor / empresa
        País | Desde [año]
        ⭐ 4.8 promedio | 1,245 ventas | 98% cumplimiento
        [Categorías que maneja: tags]
        [Contactar vendedor] [Solicitar cotización]
```

**Tabs de la tienda:**

**Tab Catálogo:**
- Buscador dentro de la tienda
- Filtros por categoría y disponibilidad
- Grid de productos del vendedor (tarjetas estándar)

**Tab Sobre nosotros:**
- Descripción de la empresa
- Marcas que representan
- Territorios de operación (países y regiones)
- Certificaciones y membresías
- Datos de contacto comercial

**Tab Políticas:**
- Política de entrega (tiempos, condiciones, costo)
- Política de devoluciones
- Condiciones de garantía
- Métodos de pago aceptados
- Condiciones de crédito (si aplica)

**Tab Reputación:**
- Calificación general por dimensiones:
  - Calidad del producto: ⭐ 4.9
  - Tiempo de respuesta: ⭐ 4.7
  - Cumplimiento de entrega: ⭐ 4.8
  - Documentación: ⭐ 4.6
- Listado de reseñas de compradores
- Historial de órdenes completadas (número, sin datos personales)

---

## 5.6 Productos por País `/paises` y `/paises/{pais}`

**Propósito:** Mostrar disponibilidad del catálogo filtrado por mercado específico.

**Tipo de acceso:** Público

---

### Página raíz `/paises`

- Mapa interactivo de Latinoamérica con países disponibles resaltados
- Lista de países con: nombre, flag, número de productos disponibles, número de vendedores activos
- CTA por país: "Ver productos en [país]"

---

### Página de país `/paises/{pais}`

**Header:**
- Nombre del país, flag, moneda local
- Autoridad regulatoria principal (ICA, SENASICA, SASA, INIA, etc.)
- Número de productos registrados y disponibles
- Número de vendedores activos en ese mercado

**Secciones:**
- Productos disponibles (catálogo filtrado por ese país — misma interfaz de /buscar)
- Productos registrados pendientes de vendedor
- Vendedores y distribuidores en ese país
- Expertos regionales disponibles
- Restricciones regulatorias vigentes

---

## 5.7 Cultivos `/cultivos` y `/cultivos/{cultivo}`

**Propósito:** Navegación técnica agronómica por tipo de cultivo. SEO y herramienta de decisión.

**Tipo de acceso:** Público

---

### Página raíz `/cultivos`

Grid de cultivos con imagen, nombre y número de productos disponibles:
- Maíz, Arroz, Café, Cacao, Caña de azúcar, Tomate, Papa, Banano, Plátano, Aguacate, Cítricos, Hortalizas, Pastos, Soya, Trigo, Frutales.

---

### Página de cultivo `/cultivos/{cultivo}`

**Estructura de la página:**

**Bloque 1 — Descripción del cultivo:**
- Nombre, imagen, descripción agronómica breve
- Zonas de producción en Latinoamérica
- Ciclo productivo (etapas fenológicas en línea de tiempo visual)

**Bloque 2 — Necesidades del cultivo por etapa:**

```
ETAPAS FENOLÓGICAS
──────────────────────────────────────────────────────
Germinación → Crecimiento → Floración → Fructificación → Cosecha

[Etapa: Crecimiento vegetativo]
Necesidades nutricionales principales:
  Nitrógeno (alta demanda), Fósforo (media), Potasio (media)

Productos recomendados para esta etapa:
  [Tarjeta producto 1] [Tarjeta producto 2] [Tarjeta producto 3]
```

**Bloque 3 — Plagas frecuentes (cards expandibles):**
- Nombre de la plaga
- Descripción del daño
- Condiciones que la favorecen
- Productos activos recomendados para su control (con links a productos del catálogo)

**Bloque 4 — Enfermedades frecuentes:**
- Misma estructura que plagas

**Bloque 5 — Plan de fertilización sugerido:**
- Tabla por etapa con dosis y productos sugeridos

**Bloque 6 — Plan fitosanitario sugerido:**
- Calendario de aplicaciones preventivas

**Bloque 7 — Expertos en este cultivo:**
- Cards de asesores disponibles para este cultivo

**Bloque 8 — Solicitar diagnóstico:**
- Formulario rápido de consulta técnica vinculado a este cultivo

---

## 5.8 Problemas Agrícolas `/problemas-agricolas`

**Propósito:** Herramienta de diagnóstico básico por síntoma para conectar con productos y asesores.

**Tipo de acceso:** Público

---

### Layout

**Selector inicial:**
1. ¿Qué tipo de problema tienes?
   - [ ] Deficiencia nutricional
   - [ ] Plaga (insecto, ácaro, nematodo)
   - [ ] Enfermedad (hongo, bacteria, virus)
   - [ ] Maleza
   - [ ] Estrés abiótico (sequía, calor, salinidad)

2. ¿En qué cultivo? (select de cultivos)

3. ¿Cuál es el síntoma principal? (describe brevemente — input de texto)

**Resultados:**
- Posibles causas con descripción
- Fotos de referencia para validar el diagnóstico visual
- Productos recomendados para cada causa (cards con precio y botón comprar)
- CTA: "Solicitar diagnóstico profesional" → `/asesoria-agronomica`

---

## 5.9 Expertos Regionales `/expertos`

**Propósito:** Directorio de asesores y especialistas agronómicos disponibles.

**Tipo de acceso:** Público para ver; requiere cuenta para contactar o agendar.

---

### Layout

**Filtros:**
- País (select)
- Cultivo de especialización (multi-select)
- Categoría agro (fertilizantes, biológicos, fitosanidad, etc.)
- Disponibilidad (esta semana)

**Card de experto:**
```
┌────────────────────────────────┐
│ [Foto]  Ing. Carlos Ramírez    │
│         Agrónomo — Colombia    │
│         ⭐ 4.9 (87 consultas) │
├────────────────────────────────┤
│ Especialidad:                  │
│ Fertilización en café y maíz   │
├────────────────────────────────┤
│ Cultivos: Café • Maíz • Papa   │
│ Zonas: Antioquia, Eje Cafetero │
├────────────────────────────────┤
│ Próxima disponibilidad: Lunes  │
│                                │
│ [Ver perfil] [Solicitar cita]  │
└────────────────────────────────┘
```

**Perfil del experto `/expertos/{slug}`:**
- Foto, nombre, título, especialidades
- Trayectoria y certificaciones
- Cultivos atendidos y países de operación
- Calificación detallada y reseñas
- Calendario de disponibilidad (vista semanal)
- Formulario de solicitud de cita o consulta

---

## 5.10 Biblioteca Técnica `/biblioteca`

**Propósito:** Repositorio público de documentos técnicos, guías y contenido educativo agro.

**Tipo de acceso:** Público para navegar; algunos documentos requieren cuenta (SDS, fichas completas).

---

### Layout

**Filtros:**
- Tipo de documento: Ficha técnica | SDS | Etiqueta | Certificado | Guía | Video | FAQ
- Categoría de producto
- Cultivo
- Idioma
- País

**Resultados:**

Cards de documentos con:
- Icono del tipo (PDF, video, etc.)
- Título del documento
- Producto o categoría asociada
- Fabricante o fuente
- Fecha de publicación / actualización
- [Descargar] o [Ver en línea]

**Vista de documento:**
- Nombre, versión, fecha
- Producto asociado (link al detalle)
- Contenido en visor PDF integrado (para fichas y SDS)
- Botones: Descargar, Compartir, Reportar documento desactualizado

---

## 5.11 Blog / Noticias `/blog`

**Propósito:** Contenido editorial para SEO, posicionamiento técnico y retención de usuarios.

**Tipo de acceso:** Público

---

### Layout

**Página raíz `/blog`:**
- Artículo destacado (hero con imagen grande)
- Grid de artículos recientes (3 columnas)
- Categorías: Fertilizantes | Biológicos | Fitosanidad | Mercado | Innovación | Crédito | Logística

**Página de artículo `/blog/{slug}`:**
- Título, autor (con foto y cargo), fecha, categorías
- Imagen de cabecera
- Contenido estructurado (H2, H3, listas, tablas)
- Sidebar: artículos relacionados, productos mencionados en el artículo
- CTA al final: relacionado con el tema del artículo
- Compartir en redes sociales

---

## 5.12 Registro `/registro`

**Propósito:** Onboarding diferenciado por tipo de usuario.

**Tipo de acceso:** Público

---

### Página raíz `/registro`

**Selector de tipo de cuenta:**

```
¿Cómo quieres usar el Marketplace Agro?

[  🌱 Comprar insumos  ]     [  🏪 Vender productos  ]
[  🏭 Soy fabricante   ]     [  🚚 Soy distribuidor  ]
```

---

### Registro de comprador `/registro/comprador`

**Formulario en 2 pasos:**

**Paso 1 — Datos personales:**
```
Nombre *               [_________________________]
Apellido *             [_________________________]
Email *                [_________________________]
Teléfono / WhatsApp *  [+57] [__________________]
País *                 [Colombia             ▼]
Contraseña *           [_________________________]
Confirmar contraseña * [_________________________]

[ ] Acepto los Términos y condiciones y la Política de privacidad

                         [Continuar →]
```

**Paso 2 — Perfil de uso:**
```
¿Para qué usarás el marketplace?
(●) Para mi finca o negocio personal
( ) Como representante de una empresa
( ) Soy agrónomo o consultor

¿Cuál es tu cultivo principal? (multi-select)
[Maíz] [Café] [Tomate] [Papa] [+ Agregar]

¿Cuál es tu país de operación? (select)
[Colombia                                   ▼]

¿Cuál es tu volumen aproximado de compra mensual?
( ) Menos de $500 USD
(●) $500 – $5,000 USD
( ) $5,000 – $50,000 USD
( ) Más de $50,000 USD

                    [← Anterior]  [Crear mi cuenta →]
```

**Paso 3 — Verificación:**
- Pantalla de confirmación: "Te enviamos un email de verificación"
- Botón: "Reenviar email" | "Cambiar email"
- Detección automática: si el email ya existe, mostrar opción de login

---

### Registro de vendedor `/registro/vendedor`

**Formulario en 3 pasos:**

**Paso 1 — Datos del representante:**
```
Nombre completo *         [_________________________]
Cargo en la empresa *     [_________________________]
Email corporativo *       [_________________________]
Teléfono de contacto *    [+57] [__________________]
País de operación *       [Colombia             ▼]
Contraseña *              [_________________________]
```

**Paso 2 — Datos de la empresa:**
```
Nombre de la empresa *      [_________________________]
Nombre comercial            [_________________________]
RIF / NIT / RFC / CNPJ *    [_________________________]
País de constitución *      [Colombia             ▼]
Tipo de empresa *           [Distribuidor        ▼]
                            (Distribuidor / Fabricante /
                            Importador / Representante)

Dirección de la empresa *   [_________________________]
Ciudad *                    [_________________________]
Código postal               [_________________________]

Categorías de productos que maneja * (multi-select)
[Fertilizantes] [Herbicidas] [Fungicidas] [+ Agregar]

Países donde vende * (multi-select)
[Colombia] [Venezuela] [Ecuador] [+ Agregar]

Marcas que representa
[_________________________] [+ Agregar]

¿Cuál es tu volumen mensual de ventas?
( ) Menos de $10,000 USD
(●) $10,000 – $100,000 USD
( ) Más de $100,000 USD

Logo de la empresa (opcional)
[ Subir imagen ]  (.JPG, .PNG, máx 2MB)
```

**Paso 3 — Documentos de empresa:**
```
Para operar como vendedor, necesitamos validar tu empresa.

Documentos obligatorios:
[ Subir ] RUT / Registro mercantil / Acta constitutiva *
[ Subir ] Cédula o pasaporte del representante legal *
[ Subir ] Certificado de cámara de comercio (si aplica)

Documentos opcionales:
[ Subir ] Certificaciones de calidad (ISO, BPA, etc.)
[ Subir ] Contratos de distribución con fabricantes

Los documentos son revisados en 2–5 días hábiles.
Recibirás un email cuando tu cuenta esté activada.

[ ] Acepto los Términos para vendedores y el Acuerdo de comisiones

                    [← Anterior]  [Enviar solicitud →]
```

---

### Registro de fabricante `/registro/fabricante`

Similar al de vendedor, con campos adicionales:
- Lista de líneas de productos propios
- Upload de registros sanitarios por país
- Distribuidores autorizados (lista opcional)
- Declaración de territorio y condiciones de distribución

---

## 5.13 Login `/login`

**Propósito:** Autenticación de todos los tipos de usuario.

---

### Formulario de login

```
Iniciar sesión

Email *           [_________________________]
Contraseña *      [_________________________]  [👁️]

                    [Iniciar sesión]

¿Olvidaste tu contraseña? → /recuperar-contrasena
¿No tienes cuenta? → /registro

─── O inicia sesión con ───

[  Google  ]   [  Microsoft  ]
```

**Comportamiento post-login:**
- Comprador → `/dashboard/comprador`
- Vendedor → `/dashboard/vendedor`
- Corporativo → `/dashboard/comprador-corporativo`
- Regulatorio → `/dashboard/regulatorio`
- Admin → `/admin`

**Estados de error:**
- Credenciales incorrectas: "Email o contraseña incorrectos. 2 intentos restantes."
- Cuenta no verificada: "Verifica tu email antes de iniciar sesión."
- Cuenta suspendida: "Tu cuenta está suspendida. Contacta a soporte."
- 2FA requerido (admin/regulatorio): pantalla de ingreso de código TOTP

---

# 6. MARKETPLACE TRANSACCIONAL

## 6.1 Catálogo Comercial `/productos`

**Propósito:** Vista principal de todos los productos disponibles para compra.

**Tipo de acceso:** Público para navegar; cuenta requerida para comprar.

**Layout:** Idéntico al buscador (sección 5.2) pero sin query inicial, mostrando todos los productos paginados.

**Elementos adicionales:**
- Banner promocional rotativo en la parte superior
- "Recientemente vistos" (para usuarios autenticados)
- Sugerencias personalizadas por cultivo o compras anteriores

---

## 6.2 Carrito B2B `/carrito`

**Propósito:** Consolidar productos seleccionados antes del checkout. Permite compra multi-vendedor con validación regulatoria.

**Tipo de acceso:** Comprador autenticado

---

### Layout

**Encabezado:**
```
Mi carrito (8 productos · 2 vendedores)
```

**Sección por vendedor:**

```
┌─ Vendedor: DistAgroMax ──────────────────────────────────────────┐
│                                                                    │
│  [Img] Glifosato 480 SL — 5 Lt                                    │
│        AgroMax | Herbicida | Colombia ✓                           │
│        Precio: $45.00/unidad                                      │
│        Cantidad: [-] [3] [+]    Subtotal: $135.00                │
│        [✓] Regulado y disponible en Colombia                     │
│        [🗑️ Eliminar]  [♡ Guardar para después]                    │
│                                                                    │
│  [Img] NPK 15-15-15 — 25 Kg                                      │
│        NutriMax | Fertilizante | Colombia ✓                       │
│        Precio: $38.00/unidad                                      │
│        Cantidad: [-] [10] [+]   Subtotal: $380.00                │
│        [✓] Disponible en Colombia                                │
│        [🗑️ Eliminar]  [♡ Guardar para después]                    │
│                                                                   │
│  Subtotal DistAgroMax:  $515.00                                   │
│  Flete estimado:          $25.00                                  │
└──────────────────────────────────────────────────────────────────┘

┌─ Vendedor: AgroSuministros VE ───────────────────────────────────┐
│  [Img] Clorpirifos 480 EC — 1 Lt                                  │
│        ⚠️ ADVERTENCIA: Este producto tiene restricciones          │
│        en Colombia. Verificar uso autorizado.                     │
│        [Ver restricciones]                                        │
│                                                                    │
│        Cantidad: [-] [5] [+]    Subtotal: $75.00                 │
│        [🗑️ Eliminar]                                              │
│                                                                   │
│  Subtotal AgroSuministros:  $75.00                                │
│  Flete estimado:              $35.00                              │
└──────────────────────────────────────────────────────────────────┘
```

**Panel resumen (columna derecha o inferior):**

```
┌──────────────────────────────┐
│  RESUMEN DEL PEDIDO          │
├──────────────────────────────┤
│  Productos (8):   $590.00    │
│  Flete estimado:   $60.00    │
│  IVA (19%):       $112.10    │
├──────────────────────────────┤
│  Total estimado: $762.10     │
├──────────────────────────────┤
│  País de entrega:            │
│  [Colombia              ▼]  │
├──────────────────────────────┤
│  [  PROCEDER AL PAGO  ]     │
│  [  SOLICITAR COTIZACIÓN]   │
├──────────────────────────────┤
│  ¿Tienes un cupón?          │
│  [________________] [Aplicar]│
└──────────────────────────────┘
```

**Validaciones en tiempo real:**
- Si un producto no está disponible en el país seleccionado → badge de advertencia
- Si un producto tiene restricción → badge rojo con explicación
- Si el stock es insuficiente → badge naranja con cantidad disponible
- Si el vendedor no entrega a la dirección → notificación

**Sección inferior:**
- "Productos guardados para después"
- "Compradores también vieron"
- "Completa tu pedido con estos productos"

---

## 6.3 RFQ / Solicitud de Cotización `/rfq/nueva`

**Propósito:** Crear una solicitud de cotización B2B para compras por volumen o productos especiales.

**Tipo de acceso:** Comprador autenticado

---

### Formulario de nueva RFQ

**Paso 1 — Información de la solicitud:**

```
NUEVA SOLICITUD DE COTIZACIÓN (RFQ)

Nombre de la solicitud *
[Compra trimestral de herbicidas — Q3 2026___________]

Referencia interna (opcional)
[REF-2026-0892____________________________________]

País de entrega *              Ciudad / Región *
[Colombia                ▼]    [Medellín, Antioquia  ▼]

Dirección de entrega *
[Cra 50 #12-34, Zona Industrial___________________]

Fecha de entrega requerida *
[📅 15/07/2026]

Condiciones de pago preferidas
(●) Contado
( ) 30 días
( ) 60 días
( ) 90 días
( ) Crédito (requiere cupo aprobado)

Observaciones generales
[____________________________________________]
[Incluir certificado de calidad para cada lote.]
[____________________________________________]
```

**Paso 2 — Productos solicitados:**

```
PRODUCTOS REQUERIDOS

[+ Agregar producto]

──────────────────────────────────────────────────────────────────
Ítem 1
Producto *       [Buscar producto o escribe el nombre________]
                 ✓ Glifosato 480 SL (Herbicida / AgroMax)

Cantidad *       [500_________]  Unidad * [Litros    ▼]

Presentación     [5 Lt         ▼]  (opcional)

Especificaciones técnicas adicionales
[Concentración mínima 480 g/L. Sin impurezas.________]

Documentos requeridos del vendedor
[x] Ficha técnica
[x] Hoja de seguridad
[x] Certificado de análisis por lote
[ ] Registro ICA Colombia
──────────────────────────────────────────────────────────────────
Ítem 2
[Buscar producto o escribe el nombre____________________________]

[+ Agregar producto]
```

**Paso 3 — Vendedores a invitar:**

```
¿A quiénes quieres enviar esta RFQ?

(●) Que el sistema identifique vendedores calificados automáticamente
( ) Invitar vendedores específicos

Vendedores disponibles para estos productos (sugeridos):
[x] DistAgroMax — Colombia — ⭐ 4.9 — 12 productos matching
[x] AgroSuministros CO — Colombia — ⭐ 4.7 — 8 productos matching
[ ] AgriShop VE — Venezuela — ⭐ 4.5 — 5 productos matching
[x] NutriField EC — Ecuador — ⭐ 4.8 — 10 productos matching

[+ Agregar vendedor manualmente por email]

Fecha límite para recibir ofertas *
[📅 05/07/2026]
```

**Paso 4 — Revisión y envío:**
- Resumen completo de la RFQ (productos, cantidades, vendedores, fechas)
- Botón: "Enviar RFQ" → Confirmación + notificaciones a vendedores

---

## 6.4 Comparación de Ofertas `/rfq/{id}/ofertas`

**Propósito:** Comparar propuestas recibidas de diferentes vendedores para una misma RFQ.

**Tipo de acceso:** Comprador dueño de la RFQ

---

### Layout

**Header:**
```
RFQ #2026-0892 — Compra trimestral de herbicidas
Estado: 3 ofertas recibidas | Cierra en 2 días 4 horas
```

**Tabla comparativa:**

| | DistAgroMax | AgroSuministros CO | NutriField EC |
|---|---|---|---|
| **Rating del vendedor** | ⭐ 4.9 | ⭐ 4.7 | ⭐ 4.8 |
| **Glifosato 480 SL 500L** | $42.50/Lt | $44.00/Lt | $41.00/Lt |
| **NPK 15-15-15 1000Kg** | $35.00/Kg | $36.50/Kg | $34.80/Kg |
| **Total productos** | $37,250 | $38,500 | $36,800 |
| **Flete incluido** | No ($450) | Sí | No ($380) |
| **Total con flete** | $37,700 | $38,500 | $37,180 |
| **Tiempo de entrega** | 5 días | 7 días | 4 días |
| **Validez oferta** | 15 días | 10 días | 20 días |
| **Cond. de pago** | 30 días | Contado | 30 días |
| **Ficha técnica** | ✓ | ✓ | ✓ |
| **Certificado lote** | ✓ | ✗ | ✓ |
| **Acción** | [Negociar] [Aceptar] | [Negociar] [Aceptar] | [Negociar] [Aceptar] |

**Panel de negociación (modal al hacer clic en "Negociar"):**
```
Contraoferta a DistAgroMax

Precio propuesto por ítem:
  Glifosato 480 SL: [$42.50/Lt] → [$41.00/Lt]
  NPK 15-15-15:    [$35.00/Kg] → [$33.50/Kg]

Condiciones adicionales solicitadas:
[Incluir flete gratis para pedidos sobre $35,000_______]
[Certificado de análisis por cada lote entregado.______]

Plazo para respuesta:
[📅 04/07/2026]

[Enviar contraoferta]
```

---

## 6.5 Checkout B2B `/checkout`

**Propósito:** Confirmación final de la compra con validación completa antes de crear la orden.

**Tipo de acceso:** Comprador autenticado

---

### Flujo del checkout (4 pasos)

**Paso 1 — Dirección de entrega:**

```
DIRECCIÓN DE ENTREGA

(●) Usar dirección guardada
    Cra 50 #12-34, Medellín, Colombia — Finca El Cedro

( ) Nueva dirección
    Nombre del destinatario *  [_________________________]
    Empresa (opcional)         [_________________________]
    Dirección *                [_________________________]
    Ciudad *                   [_________________________]
    Estado / Departamento *    [_________________________]
    Código postal              [_________________________]
    País *                     [Colombia             ▼]
    Teléfono de contacto *     [_________________________]
    Instrucciones de entrega   [_________________________]
    [Guardar esta dirección]

                                           [Continuar →]
```

**Paso 2 — Método de pago:**

```
MÉTODO DE PAGO

(●) Tarjeta de crédito / débito
    [  Número de tarjeta    ] [MM/AA] [CVV]
    [ ] Guardar para futuras compras

( ) Transferencia bancaria
    Recibirás los datos para transferencia al confirmar.
    Orden se activa al confirmar el pago.

( ) Crédito del marketplace
    Cupo disponible: $12,500 USD  ✓
    Cupo a usar:     [_________]
    Condición:       30 días

( ) PSE (Colombia)    ( ) OXXO (México)    ( ) Pix (Brasil)

──────────────────────────────────────────
¿Tienes código de descuento?
[_________________________] [Aplicar]
                                           [Continuar →]
```

**Paso 3 — Datos de facturación:**

```
DATOS DE FACTURACIÓN

(●) Usar datos de mi empresa
    Inversiones Agro SAS
    NIT: 900.XXX.XXX-X | Colombia

( ) Facturar a otra razón social
    Razón social *   [_________________________]
    NIT / RIF *      [_________________________]
    Dirección fiscal [_________________________]
    Email factura *  [_________________________]
    Régimen fiscal   [Responsable de IVA   ▼]

Tipo de documento:
(●) Factura electrónica
( ) Nota de crédito / débito
                                           [Continuar →]
```

**Paso 4 — Revisión y confirmación:**

```
RESUMEN FINAL

Orden #1 — DistAgroMax
  Glifosato 480 SL 5Lt x3          $135.00
  NPK 15-15-15 25Kg x10            $380.00
  Flete DistAgroMax                  $25.00
  Subtotal                          $540.00

Orden #2 — AgroSuministros VE
  Clorpirifos 480 EC 1Lt x5         $75.00
  Flete AgroSuministros              $35.00
  ⚠️ Restricciones en Colombia:
  Solo para uso profesional
  certificado.
  Subtotal                          $110.00

────────────────────────────────────
Subtotal productos:               $590.00
Flete total:                       $60.00
IVA (19%):                        $112.10
Descuento (código AGRO10):        -$59.00
────────────────────────────────────
TOTAL A PAGAR:                    $703.10

Método de pago: Visa •••• 4242
Facturación: Inversiones Agro SAS

[ ] Acepto los Términos y condiciones y la
    política de devoluciones del marketplace.

            [← Volver]  [CONFIRMAR PEDIDO →]
```

---

## 6.6 Órdenes `/ordenes`

**Propósito:** Historial y gestión de todas las órdenes del comprador o vendedor.

**Tipo de acceso:** Comprador / Vendedor / Admin (con vistas filtradas)

---

### Layout

**Tabs de estado:**
Todas | Pendiente | Confirmada | En preparación | Despachada | En tránsito | Entregada | Cancelada | En reclamo | Devuelta

**Filtros:**
- Rango de fechas
- Vendedor (solo para comprador con múltiples vendedores)
- Comprador (solo para vendedor/admin)
- Número de orden
- Monto

**Fila de orden en tabla:**
| # Orden | Fecha | Vendedor | Productos | Total | Estado | Acciones |
|---|---|---|---|---|---|---|
| ORD-2026-001 | 01/06/26 | DistAgroMax | 3 productos | $703.10 | En tránsito | [Ver] [Rastrear] |

---

## 6.7 Detalle de Orden `/ordenes/{id}`

**Propósito:** Vista completa de una orden específica con todos sus estados, documentos y acciones.

**Tipo de acceso:** Comprador dueño / Vendedor de la orden / Admin

---

### Layout

**Header de la orden:**
```
Orden #ORD-2026-001
Creada: 01/06/2026 | Estado: En tránsito
Comprador: Inversiones Agro SAS
Vendedor: DistAgroMax
```

**Timeline de estados:**
```
✅ Pedido recibido     01/06 09:15
✅ Pago confirmado     01/06 09:22
✅ Preparación         02/06 08:00
✅ Despachado          03/06 14:30
🔄 En tránsito         04/06 (estimado entrega: 06/06)
○  Entregado
○  Calificado
```

**Tabs del detalle:**

**Tab Productos:**
- Lista de productos con nombre, cantidad, precio unitario, subtotal
- Documentos técnicos por producto (ficha, SDS)

**Tab Documentos:**
- Factura electrónica PDF
- Remisión / guía de despacho
- Certificado de análisis por lote (si aplica)
- Documentos regulatorios adjuntos

**Tab Tracking:**
- Código de guía
- Operador logístico
- Línea de tiempo de eventos de tracking
- Mapa con ubicación estimada del paquete (si disponible)
- Foto de prueba de entrega (cuando esté disponible)

**Tab Pagos:**
- Estado del pago
- Método usado
- Número de transacción
- Fecha y hora de confirmación
- Factura(s) asociada(s)

**Tab Reclamos / Soporte:**
- Botón: "Abrir reclamo"
- Historial de reclamos (si existen)
- Chat de soporte vinculado a esta orden

**Acciones disponibles según rol y estado:**

Comprador: Cancelar (si pendiente) | Abrir reclamo (si entregado) | Descargar factura | Calificar

Vendedor: Confirmar | Marcar como despachado | Subir guía | Responder reclamo

Admin: Ver todo | Forzar estado | Gestionar reclamo | Aplicar reembolso

---

# 7. DASHBOARDS DE USUARIO

## 7.1 Dashboard Comprador Agro `/dashboard/comprador`

**Propósito:** Panel de control central del comprador individual.

---

### Layout

**Header de bienvenida:**
```
Buenos días, Carlos 🌱
Tienes 2 órdenes en tránsito y 1 oferta de cotización esperando.
```

**KPIs rápidos (cards):**
```
[Órdenes activas: 3] [Cotizaciones abiertas: 1] [Facturas pendientes: $350] [Crédito disponible: $8,500]
```

**Módulos del dashboard:**

**Sección: Mis órdenes recientes**
- Tabla con las últimas 5 órdenes (estado, fecha, total, acción)
- Link: "Ver todas mis órdenes"

**Sección: Cotizaciones activas**
- Lista de RFQs abiertas con fecha de cierre y número de ofertas recibidas
- CTA: "Nueva cotización"

**Sección: Tracking activo**
- Mini-tarjetas con las entregas en tránsito, estado y fecha estimada

**Sección: Mi historial de asesoría**
- Últimas consultas técnicas (cultivo, asesor, estado)
- CTA: "Nueva consulta"

**Sección: Productos frecuentes**
- "Comprar de nuevo" — últimos 5 productos comprados con botón de recompra rápida

**Sección: Alertas y notificaciones**
- Orden entregada: "Califica tu compra"
- Cotización con nueva oferta
- Vencimiento de crédito

---

## 7.2 Dashboard Comprador Corporativo `/dashboard/comprador-corporativo`

**Propósito:** Panel ejecutivo para gestionar la operación de compras de toda la empresa.

---

### Módulos del dashboard

**KPIs ejecutivos:**
```
[Gasto total YTD: $245,000] [Órdenes este mes: 34] [Aprobaciones pendientes: 7] [Crédito usado: 68%]
```

**Sección: Aprobaciones pendientes (prioritaria)**
- Tabla de solicitudes esperando aprobación
- Columnas: Solicitante, Sede, Total, Proveedor, Fecha, [Aprobar] [Rechazar]

**Sección: Usuarios de mi empresa**
- Lista de usuarios activos con rol, última actividad y estado
- Botón: "Invitar usuario" | "Gestionar permisos"

**Sección: Gasto por sede / finca / centro de costo**
- Gráfico de barras: top 5 centros de costo por gasto
- Link a reporte detallado

**Sección: Órdenes corporativas recientes**
- Tabla con orden, solicitante, sede, proveedor, total, estado

**Sección: Contratos activos**
- Lista de contratos marco vigentes con proveedor, vigencia y estado

**Sección: Estado del crédito**
- Cupo total | Cupo usado | Cupo disponible
- Próximos vencimientos
- CTA: "Solicitar ampliación"

---

## 7.3 Dashboard Vendedor `/dashboard/vendedor`

**Propósito:** Centro de operaciones del vendedor para gestionar su tienda en el marketplace.

---

### Módulos del dashboard

**KPIs de ventas:**
```
[Ventas hoy: $1,250] [Órdenes pendientes: 8] [Productos activos: 134] [Rating: ⭐ 4.8]
```

**Sección: Órdenes por atender (urgente)**
- Lista de órdenes en estado "Pendiente de confirmación" con tiempo transcurrido
- Acciones rápidas: [Confirmar] [Rechazar] [Contactar comprador]

**Sección: RFQ / Cotizaciones recibidas**
- Lista de solicitudes de cotización abiertas
- Columnas: Comprador, Productos, Cantidad, Fecha límite, [Responder]

**Sección: Inventario con alertas**
- Productos con stock bajo (< umbral configurado)
- Productos próximos a vencer
- CTA: "Actualizar inventario"

**Sección: Documentos regulatorios**
- Documentos próximos a vencer (alerta 30 días antes)
- Productos bloqueados por regulatorio pendiente
- CTA: "Subir documentos"

**Sección: Liquidaciones**
- Próxima liquidación: fecha y monto estimado
- Historial de liquidaciones pagadas

**Sección: Rendimiento**
- Gráfico de ventas últimos 30 días
- Productos más vendidos
- Comparación mes anterior

---

## 7.4 Dashboard Fabricante `/dashboard/fabricante`

**Propósito:** Control de la línea de productos, distribuidores y demanda de mercado.

---

### Módulos del dashboard

**KPIs:**
```
[Líneas activas: 8] [Distribuidores: 24] [Registros vigentes: 45 países] [Demanda este mes: +12%]
```

**Sección: Mis líneas de producto**
- Tabla de productos con estado regulatorio por país, ventas del mes y distribuidores asignados

**Sección: Distribuidores autorizados**
- Mapa o lista de distribuidores por territorio
- Estado de cada distribuidor (activo, suspendido, por vencer contrato)

**Sección: Registros regulatorios**
- Tabla de registros por país con estado y vigencia
- Alertas de registros por vencer
- CTA: "Renovar registro"

**Sección: Demanda de mercado**
- Volúmenes de venta por producto, país y período
- Solicitudes de sourcing sin proveedor asignado

**Sección: Reclamos de calidad**
- Reclamos vinculados a productos de la marca
- Estado de resolución

---

## 7.5 Dashboard Distribuidor `/dashboard/distribuidor`

**Propósito:** Gestión de operaciones del distribuidor en su territorio asignado.

---

### Módulos del dashboard

**KPIs:**
```
[Territorio: Antioquia-Caldas] [Clientes activos: 87] [Ventas este mes: $34,500] [Productos: 45]
```

**Sección: Mis productos autorizados**
- Lista de productos que puede vender según contrato con fabricante
- Stock disponible y estado regulatorio por producto

**Sección: Pedidos regionales**
- Órdenes entrantes de clientes en su territorio
- CTA: atender y despachar

**Sección: Clientes regionales**
- Lista de compradores en su territorio con historial de compras

**Sección: Inventario local**
- Stock en bodega por producto
- Alertas de bajo inventario

---

## 7.6 Dashboard Asesor Agronómico `/dashboard/asesor`

**Propósito:** Gestión de consultas técnicas, diagnósticos y planes agronómicos.

---

### Módulos del dashboard

**KPIs:**
```
[Consultas pendientes: 5] [Diagnósticos esta semana: 12] [Planes activos: 8] [Rating: ⭐ 4.9]
```

**Sección: Consultas por atender (prioritaria)**

```
──────────────────────────────────────────────────────────
[Foto] Carlos López — Café — Antioquia, Colombia
       "Manchas amarillas en hojas superiores desde hace 3 días"
       📷 3 fotos adjuntas | Hace 2 horas
       [Ver detalle] [Asignar diagnóstico]
──────────────────────────────────────────────────────────
[Foto] María García — Tomate — Cundinamarca, Colombia
       "Plaga en tallos, pérdida de 20% del lote"
       📷 5 fotos adjuntas | Hace 4 horas
       [Ver detalle] [Asignar diagnóstico]
```

**Pantalla de consulta individual:**
- Datos del comprador y finca
- Fotos del problema
- Cultivo, etapa fenológica, síntomas
- Formulario de diagnóstico:
  ```
  Diagnóstico *
  [___________________________________________]
  [Mancha angular causada por Pseudocercospora]
  [_________________________________]

  Causa probable *
  (●) Hongo  ( ) Bacteria  ( ) Virus  ( ) Nutricional  ( ) Abiótico

  Recomendación de productos * (buscar del catálogo)
  [+ Agregar producto]
    • Cobre Pentahidratado 53.8% — 2.5 g/Lt cada 7 días por 3 aplicaciones
    • Silicio foliar — 1 Lt/ha preventivo

  Plan técnico detallado
  [___________________________________________]
  [Aplicar fungicida cúprico en intervalos de___]
  [7 días por 3 ciclos. Verificar humedad de___]
  [suelo. Repetir diagnóstico en 10 días._____]

  Visita de campo requerida
  ( ) Sí   (●) No

  [Enviar diagnóstico al comprador]
  ```

**Sección: Planes activos**
- Lista de planes de fertilización y fitosanitarios activos con seguimiento

**Sección: Agenda**
- Calendario de visitas de campo y citas programadas

---

## 7.7 Dashboard Operador Logístico `/dashboard/logistica`

**Propósito:** Gestión de despachos, rutas, tracking e incidencias.

---

### Módulos del dashboard

**KPIs:**
```
[Por despachar hoy: 23] [En tránsito: 45] [Entregados ayer: 18] [Incidencias activas: 3]
```

**Sección: Despachos de hoy**
- Lista de órdenes listas para despachar
- Columnas: Orden, Destino, Vendedor, Peso, Volumen, Prioridad, [Asignar guía]

**Formulario de despacho:**
```
Orden #ORD-2026-001

Operador logístico *    [Servientrega         ▼]
Número de guía *        [SE-XXXXXXXXX__________]
Fecha de despacho *     [📅 04/06/2026]
Peso total (Kg) *       [25.5___________________]
Número de bultos *      [3_____________________]

Documentos de transporte:
[ Subir ] Manifiesto de carga
[ Subir ] Remisión del vendedor
[ Subir ] Guía de transporte

Temperatura de transporte requerida
(●) Ambiente   ( ) Refrigerado   ( ) Congelado

Instrucciones especiales
[Producto fitosanitario. Manejo con precaución.___]

[Confirmar despacho]
```

**Sección: Órdenes en tránsito**
- Mapa con ubicaciones de envíos activos
- Lista con estado, última actualización, fecha estimada

**Sección: Incidencias activas**
- Tipo: Retraso | Daño | Extravío | Rechazo en destino
- Estado: Reportado | En gestión | Resuelto
- CTA: gestionar incidencia

**Formulario de prueba de entrega:**
```
Confirmar entrega — Orden #ORD-2026-001

Fecha y hora de entrega *  [📅 06/06/2026 ⏰ 14:30]
Nombre de quien recibe *   [Ana María López___________]
Cédula de quien recibe     [43.XXX.XXX________________]
Cargo / Relación           [Encargada de bodega_______]

Firma digital              [Panel de firma táctil]

Foto de la entrega *       [📷 Subir foto]

Estado de los productos:
(●) Entregado en perfecto estado
( ) Entregado con daños menores (describir)
( ) Entregado con daños mayores (abrir reclamo)

Observaciones
[_________________________________________]

[Confirmar entrega]
```

---

## 7.8 Dashboard Analista Regulatorio `/dashboard/regulatorio`

**Propósito:** Control de calidad documental y aprobación de productos.

---

### Módulos del dashboard

**KPIs:**
```
[Productos pendientes: 12] [Aprobados esta semana: 8] [Alertas activas: 5] [Docs vencidos: 3]
```

**Cola de revisión (prioritaria):**

```
Producto: Glifosato 480 SL — DistAgroMax
Enviado: 01/06/2026 | Documentos: 4/5 cargados

Documentos cargados:
✅ Ficha técnica          ✅ Hoja de seguridad
✅ Etiqueta autorizada    ⚠️ Registro ICA (por vencer en 45 días)
❌ Certificado de calidad (faltante)

Países solicitados: Colombia, Venezuela, Ecuador
Estado: Documentación incompleta

[Aprobar parcial: solo Colombia] [Rechazar] [Solicitar documentos adicionales] [Ver FUR completo]
```

**Formulario de aprobación/rechazo:**
```
Acción regulatoria — Glifosato 480 SL

Decisión *
(●) Aprobar para los países seleccionados
( ) Rechazar con observaciones
( ) Solicitar correcciones

Países aprobados *  (editable)
[x] Colombia    [ ] Venezuela    [x] Ecuador

Comentarios al vendedor *
[El registro ICA vence en 45 días. Renovar antes___]
[de continuar vendiendo en Colombia. Certificado___]
[de calidad debe incluir análisis por lote._______]

Nivel de alerta para registro por vencer:
(●) Alerta a 30 días    ( ) Alerta a 60 días

Próxima revisión requerida:   [📅 01/08/2026]

[Confirmar decisión regulatoria]
```

**Sección: Alertas regulatorias activas**
- Tabla: Producto | Tipo de alerta | Días restantes | Responsable | Acción

**Sección: Auditoría documental**
- Log de cambios con: usuario, fecha, campo modificado, valor anterior, valor nuevo

---

## 7.9 Dashboard Analista Financiero `/dashboard/finanzas`

**Propósito:** Control de pagos, comisiones, liquidaciones e impuestos.

---

### Módulos del dashboard

**KPIs:**
```
[Pagos recibidos hoy: $12,400] [Pendientes de liquidar: $45,200] [Comisiones devengadas: $3,456] [Facturas por emitir: 8]
```

**Sección: Pagos por confirmar**
- Transferencias bancarias pendientes de validación manual
- Columnas: Orden, Comprador, Monto, Banco, Fecha, [Confirmar] [Rechazar]

**Sección: Liquidaciones a vendedores**
```
Período: Mayo 2026

Vendedor           Ventas     Comisión    A liquidar    Estado
DistAgroMax        $45,200    $2,260      $42,940       [Programar]
AgroSuministros    $23,400    $1,170      $22,230       [Programar]
NutriField         $18,700    $935        $17,765       [Programar]

[Liquidar todos]
```

**Formulario de liquidación:**
```
Liquidación — DistAgroMax
Período: 01/05/2026 — 31/05/2026

Ventas brutas:              $45,200.00
Comisión marketplace (5%):  -$2,260.00
Devoluciones:               -$450.00
Retenciones (3.5%):         -$1,582.00
─────────────────────────────────────
Total a transferir:         $40,908.00

Cuenta bancaria destino:    Bancolombia — 123-456789-00
Referencia de pago:         LIQ-2026-0045

[ Subir ] Comprobante de transferencia

[Confirmar liquidación]
```

---

## 7.10 Dashboard Atención al Cliente `/dashboard/soporte`

**Propósito:** Gestión de tickets, reclamos y garantías.

---

### Módulos del dashboard

**KPIs:**
```
[Tickets abiertos: 18] [SLA en riesgo: 3] [Reclamos activos: 7] [Resueltos hoy: 12]
```

**Cola de tickets:**
- Filtros: Por tipo (consulta, reclamo, garantía, técnico), por SLA, por prioridad
- Fila de ticket: #, Usuario, Orden, Tipo, Asunto, Tiempo abierto, SLA, [Atender]

**Pantalla de atención de ticket:**

```
Ticket #TKT-2026-0892
Tipo: Reclamo de producto dañado
Orden: #ORD-2026-001
Comprador: Carlos López
Vendedor: DistAgroMax
Prioridad: Alta | SLA: 8 horas restantes

─── Historial del ticket ───────────────────────────────────────
[04/06 10:15] Carlos López (comprador):
"Recibí los productos con el empaque roto. 2 litros
de Glifosato 480 SL llegaron derramados.
Adjunto fotos del daño."
📷 [foto1.jpg] [foto2.jpg]

[04/06 11:30] Sistema:
Ticket asignado a: Ana Martínez (Soporte)
─────────────────────────────────────────────────────────────────

Responder al comprador:
[________________________________________________]
[________________________________________________]

Acción en la orden:
( ) Solo responder al comprador
( ) Solicitar reenvío al vendedor (parcial o total)
( ) Iniciar proceso de devolución
( ) Aplicar reembolso parcial: [$__________]
( ) Escalar a gerencia

Notificar al vendedor  [x]
Registrar en historial [x]

[Enviar respuesta]
```

---

## 7.11 Dashboard Marketing `/dashboard/marketing`

**Propósito:** Gestión de contenido, campañas, SEO y presencia del marketplace.

---

### Módulos del dashboard

**Sección: Banners y destacados**
- Gestión de banners del hero de inicio (imagen, link, fecha de inicio/fin, posición)
- Productos destacados en página de inicio (drag-and-drop para ordenar)

**Sección: Campañas activas**
- Tabla: Nombre, tipo, fechas, productos incluidos, descuento, visitas, conversión

**Formulario de nueva campaña:**
```
Nombre de campaña *      [Temporada de siembra — Jun 2026__]
Tipo *                   [Descuento por cupón          ▼]
Código de cupón          [SIEMBRA10____________________]
Descuento *              [10_%]  sobre [Precio total   ▼]

Aplica a:
(●) Todas las categorías
( ) Categorías específicas: [Fertilizantes] [Semillas]
( ) Productos específicos: [buscar...]

Límites:
Usos máximos:  [500______]   Por usuario: [1_____]
Monto mínimo:  [$200_____]   Máximo desc: [$50___]

Fecha inicio *  [📅 01/06/2026]  Fin *  [📅 30/06/2026]

Estado: [Activa ▼]

[Guardar campaña]
```

**Sección: Blog y contenido**
- Lista de artículos (publicados, borradores, programados)
- Botón: "Nuevo artículo"

**Editor de artículo:**
```
Título *       [_________________________________________]
Slug (URL)     [/blog/________________________________]
Categoría *    [Fertilizantes                        ▼]
Tags           [maíz] [fertilización] [+ agregar]

Imagen destacada  [📷 Subir imagen]

Contenido (editor rich text con soporte Markdown):
[_________________________________________________]
[_________________________________________________]

SEO:
Meta title       [_________________________________________]
Meta description [_________________________________________]
Canonical        [_________________________________________]

Estado: [Borrador ▼]    Publicar en: [📅 fecha]

[Guardar borrador]  [Publicar]
```

---

# 8. MÓDULO REGULATORIO

## 8.1 Centro Regulatorio `/regulatorio`

**Propósito:** Panel de control centralizado para todo lo relacionado con regulación de productos.

**Tipo de acceso:** Analista regulatorio / Administrador

---

### Layout

**Resumen del estado regulatorio:**
```
ESTADO DEL CATÁLOGO REGULATORIO
────────────────────────────────────────────────────────────
Productos aprobados y activos:        1,234
Productos pendientes de revisión:        23
Productos con alertas (docs vencidos):   12
Productos bloqueados:                     8
Productos rechazados:                    15
────────────────────────────────────────────────────────────
```

**Tabla de productos por estado:**
- Filtros: País, Estado, Categoría, Vendedor, Tipo de alerta
- Columnas: Producto, Vendedor, Categoría, Países aprobados, Estado, Alertas, Última revisión, [Revisar]

---

## 8.2 FUR Producto `/regulatorio/fur-producto/{id}`

**Propósito:** Ficha única maestra del producto. Contiene todo lo que el analista necesita para validar.

---

### Tabs del FUR

**Tab 1 — Datos comerciales:**
```
Nombre comercial *          [Glifosato 480 SL_____________]
Nombre técnico              [Glifosato sal isopropilamina_]
Marca *                     [AgroMax______________________]
Fabricante *                [Chem International S.A._____]
Vendedor / distribuidor *   [DistAgroMax__________________]
Categoría *                 [Herbicida            ▼]
Subcategoría                [Sistémico no selectivo ▼]
Línea de producto           [_____________________________]

Presentaciones disponibles:
[+ Agregar presentación]
  Presentación 1: 1 Lt   — Código: GLIF-480-1L
  Presentación 2: 5 Lt   — Código: GLIF-480-5L
  Presentación 3: 20 Lt  — Código: GLIF-480-20L
  Presentación 4: 200 Lt — Código: GLIF-480-200L

Precio base (referencia interna): [$42.00 / Lt]
```

**Tab 2 — Datos técnicos:**
```
Ingrediente activo *        [Glifosato___________________]
Concentración *             [480_________] [g/L      ▼]

Formulación *               [SL – Solución concentrada ▼]
Modo de acción *            [Inhibición EPSPS — Sistémico]
Grupo químico               [Glicina sustituida_________]

Cultivos de uso autorizado * (multi-select)
[Maíz] [Soya] [Caña de azúcar] [Pastos] [+ Agregar]

Malezas objetivo * (multi-select)
[Gramíneas anuales] [Hoja ancha] [Ciperáceas] [+ Agregar]

Dosis por cultivo (tabla):
Cultivo         Dosis           Método
Maíz            1.5–3.0 L/ha    Aplicación dirigida
Caña de azúcar  2.0–4.0 L/ha    Total
Pastos          1.5–2.5 L/ha    Selectiva

Período de carencia *       [15 días____________________]
Intervalo de reentrada *    [12 horas___________________]

Compatibilidad:
Compatible con:   [Dicamba] [2,4-D] [+ Agregar]
Incompatible con: [Calcio foliar] [+ Agregar]
```

**Tab 3 — Datos regulatorios:**
```
Registros por país:
[+ Agregar registro de país]

País: Colombia
  Autoridad *          [ICA - Instituto Colombiano Agropecuario]
  Número de registro * [PA-0045-2020___________________________]
  Fecha de emisión *   [📅 15/03/2020]
  Fecha de vigencia *  [📅 31/12/2026]
  Estado *             [Vigente                           ▼]
  Restricciones        [Solo uso en cultivos comerciales._]
  Documento oficial    [📄 Resolución ICA PDF] [Subir]

País: Venezuela
  Autoridad *          [SASA - Servicio Autónomo de Sanidad]
  Número de registro * [VE-REG-XXX-XX_________________________]
  ... [mismo formulario]

País: Ecuador
  ...

Restricciones globales:
[ ] Prohibido en zonas de amortiguamiento de agua
[ ] Uso exclusivo por aplicador certificado
[x] Requiere equipo de protección personal específico
[ ] Restricción estacional (temporada de lluvias)

Estado de venta:
(●) Activo para venta en países aprobados
( ) Bloqueado temporalmente
( ) Retirado del catálogo
```

**Tab 4 — Documentos:**
```
Documentos cargados:

Ficha técnica
  ✅ FichaTecnica_Glifosato480_v2.pdf
  Versión: 2 | Fecha: 01/03/2026 | Subido por: DistAgroMax
  [Ver] [Descargar] [Reemplazar]

Hoja de seguridad SDS
  ✅ SDS_Glifosato480_CO_v3.pdf (Colombia)
  ✅ SDS_Glifosato480_VE_v1.pdf (Venezuela)
  [Ver] [Descargar] [+ Agregar SDS para otro país]

Etiqueta autorizada
  ✅ Etiqueta_Glifosato480_CO_ICA.pdf (Colombia)
  ⚠️ Etiqueta_VE pendiente de carga

Certificado de calidad
  ✅ CertCalidad_Lote26-001.pdf (Lote 26-001)
  ✅ CertCalidad_Lote26-002.pdf (Lote 26-002)
  [+ Agregar certificado de lote]

Certificado de origen
  ✅ CertOrigen_ChemIntl_2026.pdf
```

**Tab 5 — Historial y auditoría:**
```
Historial de cambios:

[04/06/2026 10:15] Ana Martínez (Regulatorio)
  Aprobó para Colombia. Comentario: "Documentación completa."

[03/06/2026 16:30] Carlos López (DistAgroMax)
  Subió nuevo certificado de calidad para lote 26-002.

[02/06/2026 09:00] Ana Martínez (Regulatorio)
  Rechazó. Motivo: "Falta certificado de calidad de lote."

[01/06/2026 14:00] Carlos López (DistAgroMax)
  Creó el FUR. Subió ficha técnica y hoja de seguridad.
```

---

# 9. MÓDULO B2B EMPRESARIAL

## 9.1 Empresas `/b2b/empresas`

**Propósito:** Gestión centralizada de todas las empresas registradas en la plataforma.

**Tipo de acceso:** Administrador / Analista de crédito

---

### Layout

**Tabla de empresas:**

Filtros: Tipo (compradora, vendedora, fabricante, distribuidora), País, Estado (activa, suspendida, pendiente)

| Empresa | País | Tipo | Usuarios | Estado | Crédito | Última actividad | Acciones |
|---|---|---|---|---|---|---|---|
| Inversiones Agro SAS | CO | Compradora | 12 | Activa | $50K | Hoy | [Ver] [Editar] |

**Perfil de empresa (vista admin):**
- Datos generales, documentos legales, estado de validación
- Usuarios vinculados con roles
- Sedes y fincas registradas
- Historial de compras / ventas
- Estado crediticio

---

## 9.2 Cuenta Corporativa `/b2b/cuenta-corporativa`

**Propósito:** Panel de gestión interna de la empresa compradora.

**Tipo de acceso:** Comprador corporativo (solo de su empresa)

---

### Sección: Usuarios de mi empresa

**Lista de usuarios:**
| Usuario | Cargo | Rol | Sede | Estado | [Acciones] |
|---|---|---|---|---|---|
| Luis Martínez | Gerente compras | Aprobador | Central | Activo | [Editar] [Desactivar] |

**Formulario de invitación de usuario:**
```
Invitar usuario a la empresa

Email *              [_________________________]
Nombre              [_________________________]
Cargo               [_________________________]
Rol en el marketplace *
(●) Solicitante (puede crear carritos y RFQ)
( ) Aprobador (puede aprobar solicitudes de equipo)
( ) Administrador corporativo (gestión total)

Sede / Finca asignada
[Central — Bogotá             ▼]

Centro de costo por defecto
[CC-AGRO-ANTIOQUIA           ▼]

Límite de compra sin aprobación
[$________________] (0 = siempre requiere aprobación)

[Enviar invitación]
```

---

### Sección: Sedes y fincas

**Lista de sedes:**
| Nombre | País | Ciudad | Tipo | Usuarios | Acciones |
|---|---|---|---|---|---|
| Finca El Cedro | CO | Pensilvania, Caldas | Finca | 3 | [Editar] |

**Formulario de nueva sede:**
```
Nombre de la sede / finca *    [_________________________]
Tipo *                          [Finca          ▼]
                                (Sede central / Finca / Sucursal / Depósito)
País *                          [Colombia        ▼]
Departamento / Estado *         [Caldas          ▼]
Ciudad *                        [Pensilvania     ▼]
Dirección *                     [_________________________]
Coordenadas GPS (opcional)      [Lat: ____] [Lon: ____]
Cultivos principales            [Café] [Plátano] [+ Agregar]
Área (ha)                       [_______]
Responsable de compras          [Luis Martínez       ▼]
[Guardar sede]
```

---

### Sección: Centros de costo

**Lista de centros de costo:**
| Código | Nombre | Sede | Presupuesto | Gasto actual | % Ejecutado | Acciones |
|---|---|---|---|---|---|---|
| CC-001 | Producción Café | El Cedro | $80,000 | $34,500 | 43% | [Ver] [Editar] |

---

## 9.3 Aprobaciones `/b2b/aprobaciones`

**Propósito:** Flujo de autorización interna de compras corporativas.

**Tipo de acceso:** Aprobador corporativo

---

### Reglas de aprobación (configuración)

```
Configurar reglas de aprobación

Regla 1:
  Condición:   Monto > $500 USD
  Aprobador:   Jefe de compras del área
  Escalado a:  Gerente financiero si > $5,000

Regla 2:
  Condición:   Proveedor nuevo (primera compra)
  Aprobador:   Administrador corporativo

Regla 3:
  Condición:   Centro de costo > 90% del presupuesto
  Aprobador:   Gerente de operaciones

[+ Agregar regla]
```

**Cola de aprobaciones:**

```
SOLICITUDES PENDIENTES (7)

#APR-001 | Urgente
Solicitante:  Luis Martínez
Sede:         Finca El Cedro
Productos:    12 items (ver detalle)
Proveedor:    DistAgroMax
Total:        $3,450.00
C. de costo:  CC-001 — Producción Café
              (Presupuesto restante: $45,500)
Creado hace:  2 horas

[Ver detalle completo]
[✅ Aprobar]  [❌ Rechazar]  [✏️ Solicitar ajuste]

Comentario (obligatorio al rechazar o ajustar):
[_____________________________________________]
```

---

## 9.4 Contratos Marco `/b2b/contratos`

**Propósito:** Gestión de acuerdos comerciales entre empresa compradora y vendedores.

---

### Formulario de nuevo contrato

```
NUEVO CONTRATO MARCO

Empresa compradora *    [Inversiones Agro SAS___________]
Vendedor *              [DistAgroMax____________________]

Vigencia
Inicio *    [📅 01/01/2026]    Fin *    [📅 31/12/2026]

Productos incluidos en el contrato:
[+ Agregar producto]
  Producto            Precio pactado    Vol. mínimo    Vol. máximo
  Glifosato 480 SL    $41.00/Lt        500 Lt/mes     5,000 Lt/mes
  NPK 15-15-15        $33.00/Kg        1,000 Kg/mes   10,000 Kg/mes

Condiciones generales:
Pago *               [30 días neto              ▼]
Moneda *             [USD                       ▼]
Flete *              [Incluido sobre $10,000    ▼]
Garantía *           [12 meses desde entrega    ▼]

Cláusulas especiales:
[El vendedor garantiza precio fijo por 6 meses._________]
[Derecho de primera oferta ante nuevos productos.______]

Estado *              [Borrador  ▼]
Firma electrónica     [Solicitar firma del vendedor]

[ Subir ] Contrato firmado en PDF (opcional)

[Guardar contrato]
```

---

## 9.5 Crédito B2B `/b2b/credito`

**Propósito:** Gestión de líneas de crédito para compradores empresariales.

**Tipo de acceso:** Comprador corporativo (ver su crédito) / Analista de crédito (gestionar)

---

### Vista del comprador — Mi crédito

```
ESTADO DE MI LÍNEA DE CRÉDITO

Cupo total aprobado:      $50,000 USD
Cupo utilizado:           $18,500 USD (37%)
Cupo disponible:          $31,500 USD

Condición aprobada: 30 días neto
Próximo vencimiento:
  $5,000 — Vence 15/06/2026 (10 días)
  $13,500 — Vence 30/06/2026 (25 días)

Estado: ✅ Al día

[Solicitar ampliación de cupo]
[Ver historial de pagos]
[Descargar estado de cuenta]
```

---

### Vista del analista — Gestión de crédito

**Formulario de evaluación de crédito:**
```
EVALUACIÓN DE CRÉDITO — Inversiones Agro SAS

Solicitud:         Cupo $50,000 USD / 30 días
Fecha solicitud:   01/06/2026
Analista:          Roberto Sánchez

Documentos de evaluación:
[x] Estados financieros 2024 — [📄 Ver]
[x] Declaración de renta 2024 — [📄 Ver]
[x] Referencias comerciales (3) — [📄 Ver]
[ ] Certificado de cámara de comercio (pendiente)

Score crediticio interno: 78/100 (Bajo riesgo)
Historial en plataforma:  18 meses / 0 incumplimientos

Recomendación del sistema: Aprobar $40,000 a 30 días

Decisión del analista:
(●) Aprobar
    Cupo aprobado: [$50,000___]  Condición: [30 días ▼]
( ) Aprobar parcial
( ) Rechazar

Garantías requeridas:
[ ] Sin garantía
[x] Pagaré firmado
[ ] Aval de tercero
[ ] Prenda sobre inventario

Observaciones:
[Empresa con excelente historial. Cupo completo___]
[aprobado. Revisión programada en 6 meses._______]

[Confirmar evaluación y notificar al comprador]
```

---

# 10. MÓDULO LOGÍSTICO

## 10.1 Almacén `/dashboard/almacen`

**Propósito:** Control de inventario físico, lotes, picking y packing.

---

### Sección: Inventario por producto

**Tabla de inventario:**
| Producto | SKU | Categoría | Stock actual | Unidad | Lotes | Próx. vencimiento | Ubicación bodega | Acciones |
|---|---|---|---|---|---|---|---|---|
| Glifosato 480 SL | GLIF-480-5L | Herbicida | 150 | Lt | 3 | 01/12/2026 | B-03-Rack-A | [Ajustar] [Ver lotes] |

---

### Gestión de lotes

```
Lotes — Glifosato 480 SL

Lote #26-001
  Cantidad:     500 Lt (en 100 unidades x 5Lt)
  Fecha fab.:   15/01/2026
  Vencimiento:  15/01/2028
  Certificado:  [📄 CertCalidad_Lote26-001.pdf]
  Ubicación:    Bodega B, Rack A, Nivel 2
  Estado:       Disponible

Lote #26-002
  Cantidad:     250 Lt (en 50 unidades x 5Lt)
  Fecha fab.:   01/03/2026
  Vencimiento:  01/03/2028
  Certificado:  [📄 CertCalidad_Lote26-002.pdf]
  Ubicación:    Bodega B, Rack A, Nivel 3
  Estado:       Disponible

[+ Registrar nuevo lote]
```

---

### Picking y packing (por orden)

```
PICKING — Orden #ORD-2026-001

Comprador: Inversiones Agro SAS
Entrega: Finca El Cedro, Pensilvania, Caldas

Items a preparar:
Ítem 1: Glifosato 480 SL — 5Lt x 3 unidades
  Lote a usar: #26-001 (FIFO automático)
  Ubicación: B-03-A-2
  [ ] Confirmado

Ítem 2: NPK 15-15-15 — 25Kg x 10 sacos
  Lote a usar: #26-003
  Ubicación: B-05-C-1
  [ ] Confirmado

Documentos a incluir en el paquete:
[x] Remisión
[x] Ficha técnica de cada producto
[x] SDS de cada producto
[x] Certificado de calidad por lote

Estado del packing:
[x] Cajas selladas
[x] Etiquetado HAZMAT (si aplica)
[x] Temperatura de transporte verificada
[ ] Guía de transporte adjunta

[Confirmar picking y packing]
```

---

# 11. ADMINISTRACIÓN GLOBAL

## 11.1 Panel de Admin `/admin`

**Propósito:** Dashboard ejecutivo del administrador del marketplace con visibilidad total.

**Tipo de acceso:** Administrador / Superadministrador

---

### KPIs globales

```
GMV (Gross Merchandise Value) hoy:   $48,200
Órdenes activas:                          234
Usuarios registrados:                   8,456
Vendedores activos:                         87
Productos en catálogo:                   5,234
Tickets abiertos:                           23
```

**Gráficas del dashboard:**
- Ventas por día (últimos 30 días) — línea
- GMV por categoría (este mes) — barras
- Órdenes por estado (pie chart)
- Países con más actividad (mapa de calor)

**Accesos rápidos (grid de módulos):**
- Usuarios | Empresas | Productos | Categorías
- Órdenes | Pagos | Comisiones | Liquidaciones
- Regulatorio | Logística | Soporte | Marketing
- Reportes | Configuración | Auditoría | Integraciones

---

## 11.2 Configuración del Marketplace `/admin/configuracion`

**Propósito:** Configuración global de todos los parámetros del marketplace.

---

### Tabs de configuración

**Tab: General**
```
Nombre de la plataforma *     [Marketplace Agro_____________]
URL del sitio *               [https://marketplace-agro.com]
Logo                          [📷 Subir logo] [Vista previa]
Favicon                       [📷 Subir favicon]
Idiomas disponibles:
[x] Español   [ ] Inglés   [ ] Portugués

Monedas disponibles:
[x] USD   [x] COP   [x] VEF   [x] MXN   [x] BRL
[+ Agregar moneda]

Países activos:
[x] Colombia  [x] Venezuela  [x] Ecuador  [x] México
[x] Perú  [x] Brasil  [+ Agregar país]
```

**Tab: Comisiones**
```
Estructura de comisiones por categoría:

Categoría              Comisión   Mínimo    Máximo
Fertilizantes          4.5%       $0.50     $500
Herbicidas / plaguicidas 5.0%    $1.00     $1,000
Biológicos             4.0%       $0.50     $300
Semillas               3.5%       $0.25     $200
Maquinaria             3.0%       $5.00     $2,000
Servicios              8.0%       $10.00    $500

[Agregar excepción por vendedor]
[Agregar excepción por producto]
```

**Tab: Regulatorio**
```
Documentos obligatorios por categoría:

Para publicar herbicidas / plaguicidas:
[x] Ficha técnica
[x] Hoja de seguridad (SDS) por país
[x] Etiqueta autorizada por país
[x] Registro sanitario/fitosanitario por país
[x] Certificado de calidad (por lote)

Para publicar fertilizantes:
[x] Ficha técnica
[x] Análisis nutricional certificado
[ ] Hoja de seguridad (opcional si no es peligroso)
[x] Registro si aplica por país

Alerta de vencimiento de documentos: [30_] días antes
Bloqueo automático al vencer: [x] Activo
```

**Tab: Integraciones**
```
ERP / Odoo
  URL de Odoo *        [https://odoo.empresa.com________]
  Base de datos *      [marketplace_db__________________]
  Usuario API *        [api_marketplace@empresa.com______]
  Contraseña API *     [•••••••••••••••••••••_____________]
  Estado:              ✅ Conectado | Última sync: hace 5 min
  [Probar conexión]  [Sincronizar ahora]

Pasarela de pagos
  Stripe:              ✅ Conectado (Modo producción)
    Clave pública:     pk_live_XXXXXXXXXXXX [Cambiar]
    Clave secreta:     sk_live_•••••••••••• [Cambiar]

WhatsApp Business
  Account ID:          [XXXXXXXXXX__________________]
  Token de acceso:     [•••••••••••••••••••__________]
  Número de teléfono:  [+57 310 XXX XXXX_____________]
  Estado:              ✅ Activo

Email (Resend / SendGrid)
  API Key:             [•••••••••••••••••••__________]
  Dominio de envío:    [marketplace-agro.com_________]
  Email de remitente:  [no-reply@marketplace-agro.com]
  Estado:              ✅ Activo
```

---

## 11.3 Auditoría `/admin/auditoria`

**Propósito:** Log completo e inmutable de todas las acciones críticas en la plataforma.

---

### Filtros de auditoría

```
Módulo:     [Todos              ▼]
Acción:     [Todas              ▼]
Usuario:    [_________________]
IP:         [_________________]
Desde:      [📅] — Hasta: [📅]
[Buscar]
```

**Tabla de auditoría:**
| Fecha/hora | Usuario | Rol | Módulo | Acción | Entidad afectada | IP | Detalles |
|---|---|---|---|---|---|---|---|
| 04/06 10:15 | ana.martinez | Regulatorio | Producto | Aprobación | Glifosato 480 SL | 190.xx | [Ver] |
| 04/06 09:30 | carlos.lopez | Vendedor | FUR | Subida doc | FT_Glifosato.pdf | 181.xx | [Ver] |

**Detalle de registro de auditoría:**
```
Registro #AUD-2026-45231
Fecha: 04/06/2026 10:15:32 UTC-5
Usuario: ana.martinez@agro.com (Analista Regulatorio)
IP: 190.XXX.XXX.XX | Dispositivo: Chrome 125 / Windows 11

Módulo: Regulatorio
Acción: Aprobación de producto
Entidad: Producto ID #1234 — Glifosato 480 SL

Cambios realizados:
  Campo: Estado regulatorio Colombia
  Antes: "Pendiente de revisión"
  Después: "Aprobado"

  Campo: Países autorizados
  Antes: []
  Después: ["Colombia", "Ecuador"]

Comentario registrado: "Documentación completa. Certificado de
calidad incluye análisis por lote. Registro ICA vigente hasta
31/12/2026. Aprobado para Colombia y Ecuador."
```

---

# 12. ASESORÍA AGRONÓMICA

## 12.1 Solicitud de Asesoría `/asesoria-agronomica`

**Propósito:** Portal para que compradores soliciten diagnóstico y asesoría técnica.

**Tipo de acceso:** Requiere cuenta de comprador

---

### Formulario de solicitud de diagnóstico

**Paso 1 — Contexto del problema:**
```
SOLICITAR DIAGNÓSTICO AGRONÓMICO

Tipo de consulta *
(●) Tengo un problema en mi cultivo (diagnóstico urgente)
( ) Quiero un plan de fertilización
( ) Quiero un plan fitosanitario
( ) Consulta técnica general

Cultivo afectado *
[Café                                              ▼]

Etapa fenológica del cultivo *
[Fructificación — 6 a 8 meses                      ▼]

Área afectada
[2.5___] hectáreas

País y región *
[Colombia           ▼]  [Antioquia — Suroeste  ▼]

Descripción del problema *
[Desde hace una semana noto manchas amarillas____]
[con puntos negros en las hojas más viejas. La__]
[planta parece débil y hay caída de flores. No__]
[he aplicado nada recientemente. Humedad alta.__]

Síntomas visibles (seleccionar todos los que apliquen):
[x] Manchas en hojas        [x] Decoloración amarilla
[ ] Manchas con bordes      [x] Caída de hojas/flores
[ ] Daño en frutos          [ ] Marchitez
[ ] Daño en tallo/raíz      [ ] Insectos visibles
```

**Paso 2 — Fotos del problema:**
```
Subir fotos del problema *
(Mínimo 1, máximo 10 fotos)

[📷 Subir foto] [📷 Subir foto] [📷 Subir foto]

Describe lo que muestra cada foto:
Foto 1: [Hoja con manchas amarillas — cara superior_]
Foto 2: [Hoja con manchas — cara inferior____________]
Foto 3: [Vista del lote afectado___________________]
```

**Paso 3 — Información adicional:**
```
Última aplicación de productos
[Hace 3 semanas — Fungicida cúprico_____________]

Historial de problemas anteriores
[El año pasado tuve problemas similares pero menos]
[graves. Se resolvió con cobre._________________]

Análisis de suelo disponible
( ) Sí [📄 Subir análisis]   (●) No

¿Necesitas visita presencial?
( ) Sí, preferiblemente    (●) No, diagnóstico remoto está bien

Urgencia:
( ) Alta — Pérdidas significativas ahora mismo
(●) Media — Problema en desarrollo
( ) Baja — Consulta preventiva

[← Anterior]  [Enviar solicitud de diagnóstico →]
```

**Pantalla de confirmación:**
```
✅ Solicitud enviada

Tu solicitud #DIAG-2026-0892 fue recibida.

Un asesor agronómico especializado en café
la revisará en las próximas 4 horas.

Recibirás el diagnóstico por:
✉️ Email a carlos.lopez@email.com
📱 WhatsApp al +57 312 XXX XXXX

[Ver mi solicitud]  [Volver al inicio]
```

---

# 13. FLUJOS DE PROCESO DETALLADOS

## 13.1 Flujo de validación regulatoria de producto

```
VENDEDOR                    SISTEMA                      REGULATORIO
─────────                   ───────                      ───────────
Crea FUR                    Valida campos mínimos
                            ←────────────────────────
Sube documentos             Verifica formatos y
(ficha, SDS,               tamaños de archivos
etiqueta, cert.)            ←────────────────────────

Selecciona países           Cruza contra requisitos
                            de docs por categoría
                            ────────────────────────►
                                                         Recibe en cola
                                                         de revisión

                                                         Revisa docs
                                                         Verifica vigencias
                                                         Compara con regs

Si falta doc:               Notifica al vendedor  ◄──── Rechaza con motivo
Si vigencia corta:          Crea alerta 30 días   ◄──── Aprueba con alerta
Si todo OK:                 Activa en catálogo    ◄──── Aprueba
                            por países autorizados
```

## 13.2 Flujo de pago con crédito B2B

```
COMPRADOR              SISTEMA              FINANZAS / CRÉDITO
─────────              ───────              ──────────────────
Checkout               Verifica cupo
                       disponible
                       ← Si no hay cupo → Informa al comprador

Si hay cupo:           Reserva el cupo
                       Genera la orden
                       Notifica a vendedor
                       ─────────────────────────►
                                                  Registra
                                                  deuda

Vendedor despacha      Actualiza estado
                       tracking activo

Entrega confirmada     ─────────────────────────►
                                                  Registra
                                                  factura
                                                  vencimiento

Vencimiento:           ─────────────────────────►
                                                  Genera cobro
                                                  Notifica
                                                  comprador

Comprador paga         ─────────────────────────►
                                                  Concilia
                                                  Libera cupo
```

---

# 14. MODELO DE DATOS

## Entidades principales y relaciones

```
USUARIO
  id, email, nombre, apellido, telefono, pais_id,
  rol[], empresa_id, estado, created_at

EMPRESA
  id, nombre, nombre_comercial, rif_nit, tipo
  [compradora|vendedora|fabricante|distribuidora],
  pais_id, estado, credito_id, created_at

PRODUCTO (FUR)
  id, nombre, nombre_tecnico, marca_id, fabricante_id,
  categoria_id, subcategoria_id, ingrediente_activo,
  concentracion, formulacion, estado_regulatorio,
  created_at, updated_at

REGISTRO_PAIS
  id, producto_id, pais_id, autoridad, numero_registro,
  fecha_emision, fecha_vigencia, estado, restricciones

DOCUMENTO_PRODUCTO
  id, producto_id, tipo[ficha|SDS|etiqueta|certificado|registro],
  pais_id, version, archivo_url, fecha_vigencia,
  estado[pendiente|aprobado|rechazado|vencido],
  subido_por, aprobado_por, created_at

ORDEN
  id, comprador_id, empresa_id, estado, total, moneda,
  pais_entrega, direccion_entrega, metodo_pago,
  credito_usado, factura_id, created_at

ORDEN_ITEM
  id, orden_id, producto_id, vendedor_id,
  cantidad, unidad, precio_unitario, subtotal, lote_id

RFQ
  id, comprador_id, empresa_id, titulo, estado,
  pais_destino, fecha_requerida, fecha_cierre,
  condicion_pago, created_at

RFQ_ITEM
  id, rfq_id, producto_id, cantidad, unidad,
  especificaciones, documentos_requeridos[]

OFERTA_RFQ
  id, rfq_id, vendedor_id, total, flete, condicion_pago,
  tiempo_entrega, validez, estado, created_at

CREDITO_B2B
  id, empresa_id, cupo_total, cupo_usado, condicion_pago,
  estado[activo|suspendido|bloqueado], analista_id,
  fecha_aprobacion, proxima_revision

APROBACION
  id, empresa_id, solicitante_id, aprobador_id, orden_id,
  monto, estado[pendiente|aprobado|rechazado],
  regla_aplicada, comentario, created_at

CONTRATO
  id, empresa_compradora_id, vendedor_id, estado,
  fecha_inicio, fecha_fin, condicion_pago,
  moneda, created_at

CONTRATO_ITEM
  id, contrato_id, producto_id, precio_pactado,
  volumen_minimo, volumen_maximo, unidad

TICKET_SOPORTE
  id, comprador_id, vendedor_id, orden_id, tipo,
  prioridad, estado[abierto|en_atencion|resuelto|cerrado],
  sla_horas, asignado_a, created_at

DIAGNÓSTICO_AGRO
  id, comprador_id, asesor_id, cultivo, etapa,
  pais, region, descripcion, fotos[], estado,
  diagnostico_texto, recomendacion_texto, created_at

TRACKING
  id, orden_id, operador_logistico, numero_guia,
  estado_actual, eventos[], foto_entrega,
  firma_digital, confirmado_at
```

---

# 15. INTEGRACIONES TÉCNICAS

## 15.1 Integración Odoo ERP

**Flujo de sincronización:**

| Evento en Marketplace | Acción en Odoo | Frecuencia |
|---|---|---|
| Producto aprobado | Crear/actualizar product.template | Tiempo real |
| Orden confirmada | Crear sale.order + stock.picking | Tiempo real |
| Pago confirmado | Registrar payment + factura | Tiempo real |
| Stock actualizado en Odoo | Actualizar disponibilidad en marketplace | Cada 15 min |
| Nuevo cliente | Crear res.partner en Odoo | Tiempo real |
| Liquidación aprobada | Crear vendor bill en Odoo | Al aprobar |

**Campos mapeados (ejemplo Producto):**
```
Marketplace ←→ Odoo
────────────────────────────────────────
producto.nombre ←→ product.name
producto.sku    ←→ product.default_code
producto.precio ←→ product.list_price
producto.stock  ←→ stock.quant.quantity
producto.unidad ←→ product.uom_id
```

## 15.2 Pasarela de pagos

**Flujo Stripe:**
1. Frontend crea `PaymentIntent` vía API
2. Usuario ingresa datos de tarjeta en Stripe Elements (no pasan por el servidor)
3. Stripe confirma el pago
4. Webhook `payment_intent.succeeded` → actualizar orden a "Pago confirmado"
5. Generar factura y notificar

**Métodos por país:**
| País | Métodos disponibles |
|---|---|
| Colombia | Tarjeta, PSE, Nequi, Efecty |
| México | Tarjeta, OXXO, SPEI |
| Brasil | Tarjeta, Pix, Boleto |
| Venezuela | Tarjeta, Pago móvil (en evaluación) |
| Resto | Tarjeta internacional (Visa, MC, Amex) |

## 15.3 Notificaciones

**Eventos que generan notificación:**

| Evento | Email | WhatsApp | In-app |
|---|---|---|---|
| Orden confirmada | ✓ | ✓ | ✓ |
| Pago recibido | ✓ | — | ✓ |
| Orden despachada | ✓ | ✓ | ✓ |
| Orden entregada | ✓ | ✓ | ✓ |
| Nueva oferta de RFQ | ✓ | ✓ | ✓ |
| Aprobación requerida | ✓ | ✓ | ✓ |
| Diagnóstico listo | ✓ | ✓ | ✓ |
| Documento por vencer | ✓ | — | ✓ |
| Crédito próximo vencimiento | ✓ | ✓ | ✓ |
| Ticket respondido | ✓ | — | ✓ |

---

# 16. CRITERIOS DE ACEPTACIÓN

## 16.1 Portal público

- [ ] Un visitante sin cuenta puede navegar el catálogo completo sin obstáculos.
- [ ] El buscador devuelve resultados relevantes en < 500ms.
- [ ] Cada producto muestra su estado regulatorio por país.
- [ ] Las páginas de cultivo tienen al menos 3 productos vinculados por etapa.
- [ ] El registro de comprador toma menos de 3 minutos.
- [ ] El registro de vendedor muestra confirmación de documentos recibidos.

## 16.2 Marketplace transaccional

- [ ] El carrito valida disponibilidad en tiempo real al agregar producto.
- [ ] El carrito muestra advertencia si hay productos con restricción en el país seleccionado.
- [ ] El checkout completo se ejecuta en menos de 30 segundos.
- [ ] El vendedor recibe notificación de nueva orden en menos de 1 minuto.
- [ ] El comprador puede rastrear su orden desde el dashboard.
- [ ] Una RFQ con 3 vendedores recibe al menos 1 respuesta en 24 horas.

## 16.3 Módulo regulatorio

- [ ] Ningún producto regulado puede publicarse sin aprobación completa del analista.
- [ ] Un documento vencido bloquea automáticamente la venta del producto.
- [ ] El analista puede aprobar, rechazar o solicitar correcciones desde el FUR.
- [ ] Toda aprobación queda registrada en el log de auditoría.
- [ ] Las alertas de vencimiento se generan exactamente 30 días antes.

## 16.4 Operación B2B

- [ ] Una empresa puede tener múltiples usuarios con diferentes roles.
- [ ] Una compra que supere el monto configurado requiere aprobación.
- [ ] El crédito se bloquea automáticamente si hay facturas vencidas > 10 días.
- [ ] Los reportes corporativos muestran gasto desagregado por sede y centro de costo.
- [ ] La integración con Odoo sincroniza una orden nueva en menos de 5 segundos.

## 16.5 Seguridad y rendimiento

- [ ] Todas las rutas de API requieren autenticación (excepto endpoints públicos declarados).
- [ ] Un usuario solo puede acceder a los datos de su empresa y rol.
- [ ] El tiempo de carga de la página de inicio es < 2 segundos en 4G.
- [ ] El sistema soporta 500 usuarios concurrentes sin degradación.
- [ ] Toda acción crítica está auditada con usuario, fecha, IP y cambio realizado.
- [ ] Los backups de base de datos se realizan cada 6 horas con retención de 30 días.

---

*Documento rector generado a partir del Mapa del Sitio Marketplace Agro v1.0.*  
*Versión del plan: 2.0 | Junio 2026*
