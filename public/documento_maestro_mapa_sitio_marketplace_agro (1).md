# DOCUMENTO MAESTRO — MAPA DEL SITIO DEL MARKETPLACE AGRO

## Marketplace transaccional + Ecosistema técnico agro + Catálogo técnico-regulatorio + Operación empresarial B2B

**Tipo de documento:** Documento maestro rector  
**Formato:** Markdown `.md`  
**Versión:** 1.0  
**Objetivo:** Definir la arquitectura de navegación, módulos funcionales, rutas, dashboards, jerarquía de contenidos, perfiles de usuario y criterios operativos del Marketplace Agro.  
**Base documental:** Mapa del sitio adjunto del Marketplace Agro.  

---

# 1. Propósito del documento

Este documento maestro consolida el **mapa del sitio del Marketplace Agro** como una plataforma híbrida y unificada, diseñada para operar como un sistema comercial agroindustrial completo. La plataforma debe integrar en una sola solución digital:

1. **Marketplace transaccional:** compra, venta, cotización, pagos, facturación, logística, tracking, reclamos, devoluciones y reputación.
2. **Ecosistema técnico agro:** productos agrícolas, cultivos, plagas, enfermedades, asesoría agronómica, expertos regionales, sourcing y distribución autorizada.
3. **Catálogo técnico-regulatorio:** fichas técnicas, hojas de seguridad, etiquetas, certificados, registros por país, restricciones, alertas y auditoría documental.
4. **Operación empresarial B2B:** empresas compradoras, empresas proveedoras, compradores corporativos, crédito, contratos marco, aprobaciones, centros de costo, compras recurrentes, reportes e integración con ERP/Odoo.

El objetivo final es que el Marketplace Agro no sea únicamente una tienda de agroinsumos, sino un **sistema operativo comercial agroindustrial**, preparado para productos regulados, ventas por volumen, múltiples vendedores, compradores corporativos, logística especializada, documentación técnica, asesoría agronómica y operación ERP integrada.

---

# 2. Alcance funcional del Marketplace Agro

| Bloque | Alcance principal | Resultado esperado |
|---|---|---|
| Marketplace transaccional | Catálogo, vendedores, carrito, RFQ, checkout, órdenes, pagos, facturación, logística y reviews. | Permitir transacciones completas entre compradores y vendedores agro. |
| Ecosistema técnico agro | Categorías agro, cultivos, plagas, enfermedades, planes técnicos, expertos, sourcing y distribución. | Convertir la plataforma en un ecosistema de conocimiento, asesoría y operación agroindustrial. |
| Catálogo técnico-regulatorio | FUR producto, fichas, hojas de seguridad, etiquetas, registros por país, certificados y restricciones. | Controlar productos regulados antes de publicarlos, cotizarlos o venderlos. |
| Operación B2B | Empresas, usuarios corporativos, contratos, crédito, aprobaciones, compras recurrentes y ERP. | Soportar compras empresariales complejas y ventas por volumen. |
| Administración global | Usuarios, roles, países, monedas, impuestos, comisiones, configuración, auditoría e integraciones. | Garantizar control operativo y escalabilidad multipaís. |

---

# 3. Principios rectores de diseño

| Principio | Descripción |
|---|---|
| Plataforma única | Todas las funciones deben operar dentro de una sola plataforma: compra, venta, regulación, asesoría, logística y B2B. |
| Arquitectura modular | Cada bloque debe poder evolucionar sin romper el resto del sistema. |
| Productos regulados primero | Ningún producto regulado debe venderse sin validación documental y registro por país. |
| B2B como núcleo | El marketplace debe soportar cotizaciones por volumen, contratos, crédito, aprobaciones y compras recurrentes. |
| Multi-vendedor | Varios vendedores deben poder publicar, cotizar y vender productos dentro del marketplace. |
| Multi-país | La disponibilidad, regulación, moneda, impuestos y logística deben configurarse por país. |
| Integración ERP/Odoo | Odoo debe funcionar como núcleo operativo para productos, clientes, ventas, inventario, facturación y contabilidad. |
| Trazabilidad | Toda acción crítica debe quedar auditada: productos, documentos, precios, órdenes, pagos, registros y crédito. |
| Escalabilidad | La estructura debe permitir crecer por categorías, países, vendedores, productos, usuarios y operaciones. |
| Experiencia guiada | Compradores y vendedores deben tener dashboards claros por rol y navegación orientada a tareas. |

---

# 4. Perfiles de usuario principales

| Nº | Perfil | Función principal | Dashboard sugerido |
|---:|---|---|---|
| 1 | Visitante público | Navega productos, categorías, biblioteca, expertos y contenido. | Portal público |
| 2 | Comprador agro | Compra, cotiza, paga, solicita asesoría y gestiona órdenes. | `/dashboard/comprador` |
| 3 | Comprador corporativo | Gestiona usuarios, sedes, contratos, aprobaciones, crédito y reportes. | `/dashboard/comprador-corporativo` |
| 4 | Vendedor / proveedor | Publica productos, responde RFQ, gestiona órdenes, inventario y liquidaciones. | `/dashboard/vendedor` |
| 5 | Fabricante / marca | Gestiona líneas, productos, distribuidores, registros y demanda. | `/dashboard/fabricante` |
| 6 | Distribuidor autorizado | Opera productos autorizados por territorio, marca o país. | `/dashboard/distribuidor` |
| 7 | Representante comercial | Gestiona leads, clientes, cotizaciones, oportunidades y agenda comercial. | `/dashboard/representante` |
| 8 | Asesor agronómico | Atiende diagnósticos, recomendaciones, planes de fertilización y fitosanitarios. | `/dashboard/asesor` |
| 9 | Experto regional | Atiende consultas por país, región, cultivo o categoría. | `/dashboard/experto-regional` |
| 10 | Operador logístico | Gestiona rutas, despachos, tracking, incidencias y pruebas de entrega. | `/dashboard/logistica` |
| 11 | Encargado de almacén | Controla inventario, lotes, vencimientos, picking, packing y despacho. | `/dashboard/almacen` |
| 12 | Analista regulatorio | Valida registros, documentos, restricciones, alertas y auditoría documental. | `/dashboard/regulatorio` |
| 13 | Analista financiero | Controla pagos, facturas, comisiones, liquidaciones y conciliación. | `/dashboard/finanzas` |
| 14 | Analista de crédito | Evalúa crédito comprador/proveedor, riesgo, cupos y cobranza. | `/dashboard/credito` |
| 15 | Atención al cliente | Gestiona tickets, reclamos, devoluciones, garantías y soporte. | `/dashboard/soporte` |
| 16 | Marketing / contenido | Administra banners, campañas, SEO, biblioteca y noticias. | `/dashboard/marketing` |
| 17 | Administrador marketplace | Administra usuarios, empresas, productos, órdenes, pagos, configuración y auditoría. | `/admin` |
| 18 | Superadministrador | Control global de seguridad, integraciones, parámetros y gobierno de datos. | `/admin/superadmin` |

---

# 5. Arquitectura funcional por capas

```text
MARKETPLACE AGRO INTEGRAL
│
├── Capa 1: Portal público y descubrimiento
│   ├── Inicio
│   ├── Buscador
│   ├── Categorías
│   ├── Productos por país
│   ├── Productos por cultivo
│   ├── Biblioteca técnica
│   └── Registro / login
│
├── Capa 2: Marketplace transaccional
│   ├── Catálogo comercial
│   ├── Tiendas de vendedores
│   ├── Carrito B2B
│   ├── RFQ
│   ├── Checkout
│   ├── Órdenes
│   ├── Pagos
│   ├── Facturas
│   ├── Comisiones
│   └── Liquidaciones
│
├── Capa 3: Ecosistema técnico agro
│   ├── Fertilizantes
│   ├── Biológicos
│   ├── Protección de cultivos
│   ├── Cultivos
│   ├── Plagas
│   ├── Enfermedades
│   ├── Asesoría
│   ├── Expertos
│   └── Planes técnicos
│
├── Capa 4: Catálogo técnico-regulatorio
│   ├── FUR producto
│   ├── Fichas técnicas
│   ├── Hojas de seguridad
│   ├── Etiquetas
│   ├── Certificados
│   ├── Registros por país
│   ├── Restricciones
│   └── Auditoría documental
│
├── Capa 5: Operación B2B
│   ├── Empresas
│   ├── Usuarios corporativos
│   ├── Contratos
│   ├── Crédito
│   ├── Aprobaciones
│   ├── Centros de costo
│   ├── Compras recurrentes
│   └── Reportes
│
├── Capa 6: Operación logística
│   ├── Almacenes
│   ├── Inventario
│   ├── Lotes
│   ├── Picking
│   ├── Packing
│   ├── Despacho
│   ├── Rutas
│   └── Tracking
│
└── Capa 7: Administración e integraciones
    ├── Configuración
    ├── Seguridad
    ├── Auditoría
    ├── ERP/Odoo
    ├── Pagos
    ├── WhatsApp / Email
    ├── Mapas / clima
    └── API externa
```

---

# 6. Índice maestro de navegación

| Nivel | Sección | Ruta sugerida | Tipo de acceso |
|---:|---|---|---|
| 1 | Inicio | `/` | Público |
| 1 | Buscar productos | `/buscar` | Público |
| 1 | Catálogo | `/productos` | Público / registrado |
| 1 | Categorías | `/categorias` | Público |
| 2 | Fertilizantes | `/categorias/fertilizantes` | Público |
| 2 | Biológicos | `/categorias/biologicos` | Público |
| 2 | Herbicidas | `/categorias/herbicidas` | Público / regulado |
| 2 | Insecticidas | `/categorias/insecticidas` | Público / regulado |
| 2 | Fungicidas | `/categorias/fungicidas` | Público / regulado |
| 2 | Semillas | `/categorias/semillas` | Público / regulado según país |
| 1 | Producto detalle | `/productos/{slug}` | Público / registrado |
| 1 | Tienda vendedor | `/vendedores/{slug}` | Público |
| 1 | Países | `/paises` | Público |
| 2 | Productos por país | `/paises/{pais}` | Público |
| 1 | Cultivos | `/cultivos` | Público |
| 2 | Cultivo detalle | `/cultivos/{cultivo}` | Público |
| 1 | Problemas agrícolas | `/problemas-agricolas` | Público |
| 1 | Asesoría agronómica | `/asesoria-agronomica` | Registrado |
| 1 | Expertos | `/expertos` | Público / registrado |
| 1 | Biblioteca técnica | `/biblioteca` | Público / registrado |
| 1 | Blog / noticias | `/blog` | Público |
| 1 | Carrito | `/carrito` | Comprador |
| 1 | RFQ | `/rfq` | Comprador |
| 2 | Nueva RFQ | `/rfq/nueva` | Comprador |
| 2 | Ofertas RFQ | `/rfq/{id}/ofertas` | Comprador / vendedor |
| 1 | Checkout | `/checkout` | Comprador |
| 1 | Órdenes | `/ordenes` | Comprador / vendedor / admin |
| 2 | Detalle de orden | `/ordenes/{id}` | Comprador / vendedor / admin |
| 1 | Login | `/login` | Público |
| 1 | Registro | `/registro` | Público |
| 2 | Registro comprador | `/registro/comprador` | Público |
| 2 | Registro vendedor | `/registro/vendedor` | Público |
| 2 | Registro fabricante | `/registro/fabricante` | Público |
| 2 | Registro distribuidor | `/registro/distribuidor` | Público |
| 1 | Centro regulatorio | `/regulatorio` | Interno / regulatorio |
| 2 | FUR Producto | `/regulatorio/fur-producto/{id}` | Interno / regulatorio |
| 2 | Documentos regulatorios | `/regulatorio/documentos` | Interno / regulatorio |
| 1 | B2B Empresas | `/b2b/empresas` | Corporativo / admin |
| 1 | Cuenta corporativa | `/b2b/cuenta-corporativa` | Corporativo |
| 1 | Aprobaciones | `/b2b/aprobaciones` | Corporativo |
| 1 | Contratos | `/b2b/contratos` | Corporativo / vendedor |
| 1 | Crédito | `/b2b/credito` | Corporativo / finanzas |
| 1 | Administración | `/admin` | Administrador |
| 2 | Configuración | `/admin/configuracion` | Administrador |

---

# 7. Módulos funcionales del mapa del sitio

## 7.1 Portal público

| Módulo | Función | Componentes mínimos |
|---|---|---|
| Inicio | Presentar la propuesta de valor del marketplace. | Hero, buscador, categorías, productos destacados, CTA comprar/vender/cotizar. |
| Buscar productos | Permitir descubrimiento por múltiples criterios agro. | Buscador, filtros, resultados, ordenamiento, vista tabla/tarjeta. |
| Categorías agro | Organizar el catálogo por familias. | Fertilizantes, biológicos, protección de cultivos, semillas, coadyuvantes, maquinaria y servicios. |
| Productos por país | Mostrar disponibilidad según país, regulación y vendedores. | País, productos disponibles, productos registrados, expertos y distribuidores. |
| Productos por cultivo | Navegar por cultivo y necesidad técnica. | Cultivo, etapas, plagas, enfermedades, productos y planes sugeridos. |
| Biblioteca técnica | Alojar documentos, guías y manuales. | Fichas, SDS, etiquetas, certificados, guías, videos y FAQs. |
| Blog / noticias | Contenido SEO y tendencias agro. | Artículos, noticias, casos de éxito y guías de compra. |

## 7.2 Marketplace transaccional

| Módulo | Función | Componentes mínimos |
|---|---|---|
| Catálogo comercial | Mostrar productos publicados por vendedores. | Producto, precio, stock, país, vendedor, registro y CTA. |
| Detalle de producto | Integrar información comercial, técnica y regulatoria. | Precio, presentación, ficha técnica, documentos, restricciones y botones comerciales. |
| Tienda vendedor | Mostrar perfil, productos, reputación y políticas. | Logo, catálogo, marcas, condiciones, calificaciones. |
| Carrito B2B | Agrupar productos para compra directa o cotización. | Líneas, cantidades, subtotales, validación regulatoria, flete y checkout. |
| RFQ | Solicitar cotización por volumen o necesidad especial. | Productos, cantidades, destino, fecha, requisitos, vendedores invitados. |
| Comparación de ofertas | Comparar propuestas de vendedores. | Precio, flete, entrega, condiciones, documentos, ranking. |
| Checkout | Confirmar compra. | Dirección, pago, crédito, factura, logística y términos. |
| Órdenes | Controlar ciclo de venta. | Estados, pagos, facturas, tracking, documentos y reclamos. |

## 7.3 Ecosistema técnico agro

| Módulo | Función | Componentes mínimos |
|---|---|---|
| Fertilizantes | Gestionar productos nutricionales. | Nitrogenados, fosfatados, potásicos, NPK, solubles, micronutrientes, orgánicos. |
| Biológicos | Gestionar biofertilizantes, bioestimulantes y biopesticidas. | Microorganismos, certificaciones, cultivos, problemas y recomendaciones. |
| Protección de cultivos | Gestionar herbicidas, insecticidas y fungicidas. | Ingrediente activo, modo de acción, plaga, enfermedad, maleza, restricciones. |
| Cultivos | Base de navegación técnica por cultivo. | Etapas, necesidades, plagas, enfermedades, productos y expertos. |
| Asesoría agronómica | Diagnóstico y recomendación técnica. | Consulta, fotos, diagnóstico, recomendación, plan y seguimiento. |
| Expertos regionales | Conectar usuarios con especialistas. | País, cultivo, categoría, agenda y contacto. |
| Sourcing agro | Buscar proveedores/productos especiales. | RFQ, fabricantes, sustitutos, importación y condiciones. |
| Distribución autorizada | Controlar territorios y vendedores autorizados. | País, marca, producto, vendedor, vigencia y contrato. |

## 7.4 Catálogo técnico-regulatorio

| Módulo | Función | Componentes mínimos |
|---|---|---|
| FUR Producto | Ficha única maestra del producto. | Datos comerciales, técnicos, regulatorios, logísticos e historial. |
| Ficha técnica | Documentar uso y composición. | Composición, aplicación, dosis, cultivo, compatibilidad. |
| Hoja de seguridad | Gestionar SDS/MSDS. | Riesgos, manipulación, almacenamiento, transporte y emergencia. |
| Etiqueta autorizada | Controlar etiquetas oficiales. | País, versión, instrucciones, advertencias y pictogramas. |
| Certificados | Gestionar documentos de calidad y origen. | Calidad, origen, análisis, orgánico, fitosanitario. |
| Registro por país | Validar comercialización por mercado. | Autoridad, número, fecha, vigencia, estado. |
| Restricciones | Bloquear venta según país/cultivo/comprador. | Reglas, condición, causa, excepción. |
| Alertas regulatorias | Avisar vencimientos o inconsistencias. | Tipo de alerta, fecha, responsable, prioridad. |
| Auditoría documental | Trazar cambios y aprobaciones. | Versiones, usuarios, fechas, comentarios y estado. |

## 7.5 Operación B2B

| Módulo | Función | Componentes mínimos |
|---|---|---|
| Empresas | Gestionar compradores, proveedores, fabricantes y operadores. | Perfil, documentos, roles, estado y validación. |
| Cuenta corporativa | Administrar empresa compradora. | Usuarios, sedes, fincas, centros de costo, datos fiscales. |
| Aprobaciones | Flujo de autorización interna. | Reglas, aprobadores, montos, productos y estados. |
| Contratos marco | Gestionar acuerdos comerciales. | Comprador, vendedor, productos, precios, vigencia y condiciones. |
| Crédito B2B | Evaluar y controlar líneas de crédito. | Solicitud, riesgo, cupo, vencimientos, cobranza. |
| Reportes corporativos | Analizar compras y consumo. | Producto, proveedor, finca, cultivo, centro de costo. |
| Integración ERP/Odoo | Sincronizar operación empresarial. | Productos, clientes, ventas, inventario, facturación y contabilidad. |

---

# 8. Flujos principales del sitio

## 8.1 Flujo de compra directa

```text
Comprador inicia sesión
→ Busca producto
→ Consulta detalle técnico-regulatorio
→ Agrega al carrito
→ Sistema valida país, stock, documentos y restricciones
→ Comprador confirma checkout
→ Selecciona pago o crédito
→ Se genera orden
→ Se separa por vendedor si aplica
→ Se emite factura
→ Se prepara despacho
→ Se activa tracking
→ Se confirma entrega
→ Comprador califica producto/vendedor
```

## 8.2 Flujo RFQ / cotización B2B

```text
Comprador crea RFQ
→ Define productos, cantidades, destino, fecha y requisitos
→ Invita vendedores o el sistema asigna proveedores
→ Vendedores responden oferta
→ Comprador compara ofertas
→ Comprador negocia condiciones
→ Comprador acepta oferta
→ Sistema genera orden
→ Se procesa pago/crédito
→ Se activa logística y tracking
```

## 8.3 Flujo de publicación de producto regulado

```text
Vendedor crea producto
→ Carga datos comerciales
→ Carga ficha técnica, SDS, etiqueta y certificados
→ Asigna país, categoría, cultivo y restricciones
→ Analista regulatorio revisa documentos
→ Sistema aprueba o rechaza publicación
→ Producto queda disponible para venta/cotización en países autorizados
```

## 8.4 Flujo de asesoría agronómica

```text
Comprador solicita diagnóstico
→ Adjunta cultivo, síntomas, fotos, ubicación y problema
→ Sistema asigna asesor o experto regional
→ Asesor emite diagnóstico
→ Asesor recomienda productos, dosis y plan técnico
→ Comprador puede agregar productos al carrito o RFQ
→ Se guarda historial técnico del caso
```

## 8.5 Flujo corporativo B2B con aprobación

```text
Usuario solicitante crea carrito o RFQ
→ Sistema valida centro de costo y regla de aprobación
→ Aprobador recibe solicitud
→ Aprobador aprueba, rechaza o solicita ajuste
→ Si aprueba, se genera orden
→ Finanzas valida crédito/pago
→ Se procesa facturación y logística
→ Reporte se asigna a sede/finca/centro de costo
```

---

# 9. Matriz de dashboards por perfil

| Dashboard | Ruta | Usuario objetivo | Módulos visibles |
|---|---|---|---|
| Comprador agro | `/dashboard/comprador` | Agricultor, finca, comprador individual | Catálogo, carrito, RFQ, órdenes, pagos, crédito, asesoría, soporte. |
| Comprador corporativo | `/dashboard/comprador-corporativo` | Empresa agroindustrial | Usuarios, sedes, centros de costo, aprobaciones, contratos, crédito, reportes. |
| Vendedor | `/dashboard/vendedor` | Proveedor o tienda agro | Productos, precios, inventario, RFQ, órdenes, despachos, liquidaciones. |
| Fabricante | `/dashboard/fabricante` | Marca o fabricante | Líneas, registros, distribuidores, ventas, demanda, calidad. |
| Distribuidor | `/dashboard/distribuidor` | Distribuidor autorizado | Territorio, productos autorizados, clientes, inventario regional, pedidos. |
| Asesor | `/dashboard/asesor` | Especialista agronómico | Consultas, diagnósticos, planes, recomendaciones, biblioteca y agenda. |
| Regulatorio | `/dashboard/regulatorio` | Analista regulatorio | Productos pendientes, documentos, registros, restricciones, alertas y auditoría. |
| Logística | `/dashboard/logistica` | Operador logístico | Despachos, rutas, tracking, incidencias y pruebas de entrega. |
| Finanzas | `/dashboard/finanzas` | Analista financiero | Pagos, facturas, comisiones, liquidaciones, reembolsos, impuestos. |
| Crédito | `/dashboard/credito` | Analista de crédito | Solicitudes, riesgo, cupos, vencimientos, cobranza y garantías. |
| Soporte | `/dashboard/soporte` | Atención al cliente | Tickets, reclamos, devoluciones, garantías y SLA. |
| Marketing | `/dashboard/marketing` | Marketing / contenido | Banners, campañas, SEO, biblioteca y noticias. |
| Administrador | `/admin` | Administrador marketplace | Usuarios, empresas, productos, órdenes, pagos, configuración y auditoría. |

---

# 10. Reglas de navegación y permisos

| Regla | Descripción |
|---|---|
| Portal público abierto | Inicio, categorías, productos visibles, biblioteca pública y blog deben poder navegarse sin login. |
| Compra requiere cuenta | Carrito, checkout, RFQ, órdenes y pagos requieren usuario comprador autenticado. |
| Venta requiere validación | El vendedor debe estar validado antes de publicar productos. |
| Producto regulado requiere aprobación | Ningún producto regulado debe venderse sin aprobación documental. |
| País determina disponibilidad | Un producto solo debe aparecer como comprable si está disponible y autorizado en el país seleccionado. |
| Crédito requiere aprobación | El pago con crédito solo debe estar disponible para compradores con cupo aprobado. |
| Dashboards por rol | Cada usuario debe ver solo módulos correspondientes a su perfil y empresa. |
| Auditoría obligatoria | Cambios en precios, documentos, registros, órdenes, crédito y comisiones deben auditarse. |

---

# 11. Entidades funcionales principales

| Entidad | Descripción |
|---|---|
| Usuario | Persona con acceso a la plataforma. |
| Empresa | Comprador, vendedor, fabricante, distribuidor, operador logístico o aliado. |
| Producto | Insumo o servicio agro publicado en el catálogo. |
| FUR Producto | Registro maestro técnico, comercial, regulatorio y logístico del producto. |
| Vendedor | Empresa que publica y vende productos. |
| Comprador | Usuario o empresa que compra o cotiza productos. |
| Fabricante | Marca o productor original de productos agro. |
| Distribuidor | Empresa autorizada para vender productos en un territorio. |
| Cultivo | Base técnica para recomendaciones y navegación. |
| Plaga / enfermedad / maleza | Problemas agrícolas asociados a productos y recomendaciones. |
| Documento técnico | Ficha técnica, hoja de seguridad, etiqueta, certificado o manual. |
| Registro regulatorio | Permiso de comercialización por país o autoridad. |
| RFQ | Solicitud de cotización B2B. |
| Oferta | Propuesta del vendedor ante una RFQ. |
| Orden | Compra confirmada. |
| Factura | Documento fiscal de la operación. |
| Pago | Movimiento financiero asociado a orden/factura. |
| Crédito | Cupo o condición financiera B2B. |
| Contrato marco | Acuerdo comercial entre comprador y vendedor. |
| Despacho | Proceso logístico de entrega. |
| Tracking | Seguimiento de eventos logísticos. |
| Reclamo | Caso de inconformidad o disputa. |
| Review | Calificación de producto, vendedor o servicio. |

---

# 12. Integración recomendada con ERP/Odoo

| Área del Marketplace Agro | Módulo Odoo recomendado | Uso principal |
|---|---|---|
| Usuarios y contactos | Contacts / Users | Usuarios, empresas, direcciones, proveedores y clientes. |
| Catálogo base | Sales / Inventory / Product | Productos, variantes, unidades de medida, categorías y listas de precios. |
| Ventas | Sales | Cotizaciones, órdenes de venta y líneas de pedido. |
| Compras | Purchase | Compras a proveedores, abastecimiento y reposición. |
| Inventario | Inventory | Almacenes, ubicaciones, lotes, stock, picking y entregas. |
| Facturación | Accounting / Invoicing | Facturas, notas, pagos, impuestos y conciliación. |
| CRM | CRM | Leads, oportunidades, seguimiento comercial y pipeline. |
| Documentos | Documents / Attachments | Fichas técnicas, SDS, etiquetas, certificados y contratos. |
| Sitio web | Website / eCommerce | Páginas públicas, catálogo y contenido web. |
| Email y actividades | Discuss / Mail / Calendar | Mensajería, agenda, actividades y recordatorios. |
| Reportes | Spreadsheets / Reporting / BI externo | Ventas, inventario, crédito, logística, regulación y desempeño. |

---

# 13. Módulos mínimos para MVP

| Prioridad | Módulo | Justificación |
|---|---|---|
| Alta | Registro/login | Base del acceso multiusuario. |
| Alta | Gestión de empresas | Necesario para compradores, vendedores y B2B. |
| Alta | Roles y permisos | Controla acceso por perfil. |
| Alta | Catálogo agro | Núcleo del marketplace. |
| Alta | Detalle de producto | Une información comercial, técnica y regulatoria. |
| Alta | FUR Producto | Control maestro de producto regulado. |
| Alta | Documentos técnicos | Requisito para operar productos agro. |
| Alta | Registro por país | Control de disponibilidad regulatoria. |
| Alta | Tienda vendedor | Habilita multi-vendedor. |
| Alta | Publicación de productos | Permite operación comercial. |
| Alta | Carrito B2B | Compra directa. |
| Alta | RFQ | Ventas por volumen y negociación. |
| Alta | Órdenes | Núcleo transaccional. |
| Alta | Pagos / facturación | Cierre comercial. |
| Alta | Administración | Control operativo. |
| Media | Logística / tracking | Trazabilidad de entrega. |
| Media | Crédito comprador | Diferenciador B2B. |
| Media | Asesoría agronómica | Valor técnico agro. |
| Media | Biblioteca técnica | Soporte documental y SEO. |
| Baja inicial | Reviews | Puede activarse después de ventas reales. |
| Baja inicial | BI avanzado | Requiere datos históricos. |

---

# 14. Backlog maestro por épicas

| Épica | Alcance |
|---|---|
| EP-01 Portal público | Inicio, buscador, categorías, países, cultivos, biblioteca y blog. |
| EP-02 Usuarios y empresas | Registro, login, perfiles, empresas, roles y permisos. |
| EP-03 Catálogo agro | Productos, categorías, atributos, vendedores, disponibilidad y detalle. |
| EP-04 Catálogo regulatorio | FUR, documentos, registros, restricciones, aprobaciones y auditoría. |
| EP-05 Marketplace transaccional | Carrito, RFQ, ofertas, checkout, órdenes, pagos y facturas. |
| EP-06 Multi-vendedor | Tiendas, publicaciones, precios, inventario, comisiones y liquidaciones. |
| EP-07 Operación B2B | Cuentas corporativas, contratos, aprobaciones, centros de costo y crédito. |
| EP-08 Ecosistema técnico agro | Cultivos, plagas, enfermedades, asesoría, planes y expertos. |
| EP-09 Logística | Almacenes, despachos, rutas, tracking, pruebas de entrega e incidencias. |
| EP-10 Soporte y reputación | Tickets, reclamos, devoluciones, garantías y reviews. |
| EP-11 Administración | Configuración, países, monedas, impuestos, usuarios, comisiones y auditoría. |
| EP-12 Integraciones | Odoo, pagos, bancos, facturación, WhatsApp, email, mapas, clima y API. |
| EP-13 Analítica y BI | Reportes comerciales, financieros, regulatorios, logísticos y ejecutivos. |

---

# 15. Criterios de aceptación generales

| Criterio | Descripción |
|---|---|
| CA-01 | El usuario debe poder navegar el portal público sin iniciar sesión. |
| CA-02 | El comprador debe poder buscar productos por categoría, país, cultivo y problema agrícola. |
| CA-03 | El vendedor debe poder publicar productos, pero no deben quedar activos hasta ser aprobados. |
| CA-04 | El sistema debe bloquear la venta de productos regulados sin registro vigente en el país destino. |
| CA-05 | El comprador debe poder crear una RFQ con productos, cantidades, destino y fecha requerida. |
| CA-06 | El vendedor debe poder responder RFQ con precio, disponibilidad, entrega y condiciones. |
| CA-07 | El comprador debe poder comparar ofertas y aceptar una. |
| CA-08 | El checkout debe validar stock, país, restricciones, pago, crédito y documentos. |
| CA-09 | Las órdenes multi-vendedor deben separarse por vendedor para despacho y liquidación. |
| CA-10 | El sistema debe calcular comisiones y liquidaciones por vendedor. |
| CA-11 | El comprador corporativo debe poder manejar usuarios, sedes, centros de costo y aprobaciones. |
| CA-12 | El analista regulatorio debe ver productos pendientes, documentos vencidos y registros por país. |
| CA-13 | El asesor agronómico debe poder emitir recomendaciones y planes asociados a productos del catálogo. |
| CA-14 | El operador logístico debe poder actualizar estados de tracking y cargar prueba de entrega. |
| CA-15 | Todo cambio crítico debe generar auditoría: usuario, fecha, acción, registro y valor anterior/nuevo. |

---

# 16. Criterios SEO y arquitectura de URLs

| Criterio SEO | Aplicación |
|---|---|
| URL limpia | Usar rutas legibles: `/categorias/fertilizantes`, `/cultivos/maiz`, `/productos/npk-15-15-15`. |
| Categorías indexables | Fertilizantes, biológicos, herbicidas, insecticidas, fungicidas y semillas deben tener landing SEO. |
| Páginas por cultivo | Cada cultivo debe tener contenido técnico y productos recomendados. |
| Páginas por problema | Plagas, enfermedades, malezas y deficiencias deben tener páginas educativas. |
| Producto enriquecido | Cada producto debe incluir datos técnicos, documentos, FAQs y schema. |
| Biblioteca técnica | Manuales, guías y fichas deben alimentar posicionamiento orgánico. |
| Blog agro | Noticias, guías de compra, regulación y tendencias deben tener estructura editorial. |
| Multipaís | Las páginas por país deben mostrar productos autorizados y disponibilidad local. |
| Metadatos | Cada página debe tener title, description, canonical, og:image y schema cuando aplique. |

---

# 17. Riesgos funcionales y controles

| Riesgo | Control recomendado |
|---|---|
| Venta de producto no autorizado | Validación regulatoria por país antes de publicar, cotizar o vender. |
| Vendedor no validado | Onboarding obligatorio y revisión documental. |
| Producto sin ficha técnica | Bloqueo de publicación hasta completar documentos mínimos. |
| Documento vencido | Alertas y bloqueo automático según tipo de documento. |
| Error en crédito B2B | Reglas de cupo, vencimiento, mora y aprobación financiera. |
| Confusión multi-vendedor | Separación clara de órdenes por vendedor y subtotal por tienda. |
| Incumplimiento logístico | Tracking, SLA, pruebas de entrega e incidencias. |
| Reclamos sin trazabilidad | Tickets vinculados a orden, producto, lote, vendedor y comprador. |
| Datos sensibles | Roles, permisos, auditoría y control por empresa. |
| Escalabilidad multipaís | Configuración por país, moneda, impuesto, regulación y catálogo. |

---

# 18. Anexo A — Mapa del sitio base consolidado

# MAPA DEL SITIO DEL MARKETPLACE AGRO

## Marketplace transaccional + Ecosistema técnico agro + Catálogo regulatorio + Operación empresarial B2B

---

# 1. Visión general del sitio

El **Marketplace Agro** será una plataforma integral para la comercialización, cotización, compra, venta, distribución y gestión técnica de agroinsumos regulados. Su arquitectura debe permitir operar en una sola plataforma:

* Productos agro regulados.
* Fertilizantes, biológicos, herbicidas, insecticidas, fungicidas, semillas y servicios agrícolas.
* Ventas B2B por volumen.
* Múltiples vendedores.
* Compradores corporativos.
* Crédito comercial.
* Logística y tracking.
* Documentación técnica.
* Asesoría agronómica.
* Registros por país.
* Operación integrada con ERP/Odoo.

---

# 2. Árbol general del mapa del sitio

```text
MARKETPLACE AGRO
│
├── 1. Portal público
│   ├── Inicio
│   ├── Buscar productos
│   ├── Categorías agro
│   ├── Productos por país
│   ├── Productos por cultivo
│   ├── Productos por problema agrícola
│   ├── Proveedores / vendedores
│   ├── Fabricantes / marcas
│   ├── Expertos regionales
│   ├── Biblioteca técnica
│   ├── Noticias agro
│   ├── Planes y soluciones agro
│   ├── Registro
│   ├── Login
│   └── Contacto
│
├── 2. Marketplace transaccional
│   ├── Catálogo comercial
│   ├── Detalle de producto
│   ├── Tienda del vendedor
│   ├── Comparador de productos
│   ├── Favoritos
│   ├── Carrito B2B
│   ├── Solicitud de cotización RFQ
│   ├── Comparación de ofertas
│   ├── Negociación B2B
│   ├── Checkout
│   ├── Órdenes
│   ├── Pagos
│   ├── Facturas
│   ├── Tracking
│   ├── Reclamos
│   ├── Devoluciones
│   ├── Garantías
│   └── Reviews
│
├── 3. Ecosistema técnico agro
│   ├── Fertilizantes
│   ├── Biológicos agrícolas
│   ├── Herbicidas
│   ├── Insecticidas
│   ├── Fungicidas
│   ├── Semillas
│   ├── Coadyuvantes
│   ├── Correctores y enmiendas
│   ├── Maquinaria y equipos
│   ├── Servicios agrícolas
│   ├── Cultivos
│   ├── Plagas
│   ├── Enfermedades
│   ├── Malezas
│   ├── Diagnóstico agronómico
│   ├── Planes de fertilización
│   ├── Planes fitosanitarios
│   ├── Asesoría agronómica
│   ├── Sourcing agro
│   ├── Representación comercial
│   └── Distribución autorizada
│
├── 4. Catálogo técnico-regulatorio
│   ├── Ficha técnica de producto
│   ├── FUR Producto
│   ├── Composición
│   ├── Ingredientes activos
│   ├── Nutrientes
│   ├── Formulación
│   ├── Presentaciones
│   ├── Métodos de aplicación
│   ├── Dosis recomendadas
│   ├── Compatibilidad
│   ├── Hoja de seguridad
│   ├── Etiqueta autorizada
│   ├── Certificados
│   ├── Registro por país
│   ├── Restricciones de uso
│   ├── Estado regulatorio
│   ├── Alertas regulatorias
│   ├── Aprobación documental
│   ├── Versionamiento documental
│   └── Auditoría regulatoria
│
├── 5. Operación empresarial B2B
│   ├── Empresas compradoras
│   ├── Empresas proveedoras
│   ├── Usuarios corporativos
│   ├── Roles y permisos
│   ├── Sedes / fincas / sucursales
│   ├── Centros de costo
│   ├── Aprobaciones internas
│   ├── Contratos marco
│   ├── Precios B2B
│   ├── Catálogo privado por cliente
│   ├── Compras recurrentes
│   ├── Crédito comprador
│   ├── Crédito proveedor
│   ├── Cobranza
│   ├── Reportes corporativos
│   ├── Integración ERP/Odoo
│   └── BI ejecutivo
│
├── 6. Dashboards por perfil
│   ├── Dashboard comprador agro
│   ├── Dashboard comprador corporativo
│   ├── Dashboard vendedor
│   ├── Dashboard fabricante / marca
│   ├── Dashboard distribuidor autorizado
│   ├── Dashboard representante comercial
│   ├── Dashboard asesor agronómico
│   ├── Dashboard experto regional
│   ├── Dashboard operador logístico
│   ├── Dashboard almacén
│   ├── Dashboard regulatorio
│   ├── Dashboard financiero
│   ├── Dashboard crédito
│   ├── Dashboard soporte
│   ├── Dashboard marketing
│   ├── Dashboard administrador
│   └── Dashboard superadministrador
│
├── 7. Administración interna
│   ├── Usuarios
│   ├── Empresas
│   ├── Vendedores
│   ├── Compradores
│   ├── Productos
│   ├── Categorías
│   ├── Documentos
│   ├── Registros regulatorios
│   ├── Órdenes
│   ├── Pagos
│   ├── Comisiones
│   ├── Liquidaciones
│   ├── Reclamos
│   ├── Logística
│   ├── Contenido
│   ├── SEO
│   ├── Reportes
│   ├── Configuración
│   └── Auditoría
│
└── 8. Integraciones
    ├── ERP/Odoo
    ├── Pasarela de pago
    ├── Bancos
    ├── Facturación
    ├── Operadores logísticos
    ├── WhatsApp
    ├── Email
    ├── SMS
    ├── Mapas
    ├── Clima
    ├── BI / analítica
    └── API externa
```

---

# 3. Portal público

## 3.1 Inicio

**Ruta sugerida:** `/`

La página de inicio debe presentar el marketplace como una plataforma agroindustrial integral.

### Secciones recomendadas

```text
Inicio
│
├── Hero principal
│   ├── Buscador de agroinsumos
│   ├── Botón: Comprar productos
│   ├── Botón: Solicitar cotización
│   ├── Botón: Vender en el marketplace
│   └── Botón: Hablar con un experto
│
├── Categorías principales
│   ├── Fertilizantes
│   ├── Biológicos
│   ├── Herbicidas
│   ├── Insecticidas
│   ├── Fungicidas
│   ├── Semillas
│   ├── Coadyuvantes
│   ├── Maquinaria
│   └── Servicios agrícolas
│
├── Productos destacados
│   ├── Más vendidos
│   ├── Nuevos productos
│   ├── Productos en promoción
│   └── Productos por temporada
│
├── Marketplace B2B
│   ├── Compra directa
│   ├── Cotización por volumen
│   ├── Crédito comprador
│   ├── Contratos marco
│   └── Logística integrada
│
├── Ecosistema agro
│   ├── Expertos regionales
│   ├── Asesoría agronómica
│   ├── Planes de fertilización
│   ├── Planes fitosanitarios
│   └── Productos por cultivo
│
├── Catálogo regulatorio
│   ├── Fichas técnicas
│   ├── Hojas de seguridad
│   ├── Certificados
│   ├── Registros por país
│   └── Restricciones de uso
│
├── Proveedores destacados
│   ├── Fabricantes
│   ├── Distribuidores
│   ├── Representantes
│   └── Tiendas agro
│
├── Biblioteca técnica
│   ├── Manuales
│   ├── Guías de aplicación
│   ├── Noticias agro
│   └── Tendencias del mercado
│
└── Formularios rápidos
    ├── Quiero comprar
    ├── Quiero vender
    ├── Quiero cotizar
    └── Quiero asesoría técnica
```

---

## 3.2 Buscar productos

**Ruta sugerida:** `/buscar`

### Filtros principales

```text
Buscar productos
│
├── Por palabra clave
├── Por categoría
├── Por cultivo
├── Por plaga
├── Por enfermedad
├── Por maleza
├── Por ingrediente activo
├── Por nutriente
├── Por país
├── Por vendedor
├── Por fabricante
├── Por marca
├── Por presentación
├── Por método de aplicación
├── Por precio
├── Por disponibilidad
├── Por registro regulatorio
└── Por certificado
```

---

## 3.3 Categorías agro

**Ruta sugerida:** `/categorias`

```text
Categorías agro
│
├── Fertilizantes
│   ├── Nitrogenados
│   ├── Fosfatados
│   ├── Potásicos
│   ├── NPK
│   ├── NPK solubles
│   ├── Micronutrientes
│   ├── Orgánicos
│   └── Especialidades
│
├── Biológicos agrícolas
│   ├── Biofertilizantes
│   ├── Bioestimulantes
│   ├── Biopesticidas
│   ├── Microorganismos benéficos
│   └── Soluciones orgánicas
│
├── Protección de cultivos
│   ├── Herbicidas
│   ├── Insecticidas
│   ├── Fungicidas
│   ├── Acaricidas
│   ├── Nematicidas
│   └── Reguladores de crecimiento
│
├── Semillas
│   ├── Hortalizas
│   ├── Cereales
│   ├── Leguminosas
│   ├── Forrajes
│   └── Frutales
│
├── Coadyuvantes
│   ├── Adherentes
│   ├── Humectantes
│   ├── Reguladores de pH
│   └── Penetrantes
│
├── Correctores y enmiendas
│   ├── Correctores de suelo
│   ├── Enmiendas orgánicas
│   ├── Enmiendas minerales
│   └── Acondicionadores
│
├── Maquinaria y equipos
│   ├── Riego
│   ├── Fumigación
│   ├── Bombas
│   ├── Herramientas
│   └── Repuestos
│
└── Servicios agrícolas
    ├── Asesoría técnica
    ├── Análisis de suelo
    ├── Fumigación
    ├── Drones agrícolas
    ├── Monitoreo de cultivos
    └── Consultoría agroindustrial
```

---

## 3.4 Productos por país

**Ruta sugerida:** `/paises`

```text
Productos por país
│
├── Seleccionar país
│   ├── Productos disponibles
│   ├── Productos registrados
│   ├── Productos con restricción
│   ├── Vendedores autorizados
│   ├── Distribuidores locales
│   └── Expertos regionales
│
├── América Latina
│   ├── Venezuela
│   ├── Colombia
│   ├── Ecuador
│   ├── Perú
│   ├── Brasil
│   ├── Panamá
│   ├── Guatemala
│   ├── Honduras
│   ├── Nicaragua
│   ├── República Dominicana
│   └── México
│
└── Otros mercados
    ├── Estados Unidos
    ├── España
    ├── Italia
    └── Alemania
```

---

## 3.5 Productos por cultivo

**Ruta sugerida:** `/cultivos`

```text
Productos por cultivo
│
├── Maíz
├── Arroz
├── Café
├── Cacao
├── Caña de azúcar
├── Tomate
├── Papa
├── Banano
├── Plátano
├── Aguacate
├── Cítricos
├── Hortalizas
├── Frutales
├── Pastos
├── Soya
├── Trigo
└── Otros cultivos
```

### Página interna de cultivo

**Ruta sugerida:** `/cultivos/{cultivo}`

```text
Cultivo
│
├── Descripción del cultivo
├── Etapas fenológicas
├── Necesidades nutricionales
├── Plagas frecuentes
├── Enfermedades frecuentes
├── Malezas frecuentes
├── Productos recomendados
├── Plan de fertilización sugerido
├── Plan fitosanitario sugerido
├── Expertos del cultivo
├── Manuales técnicos
└── Solicitar diagnóstico
```

---

## 3.6 Productos por problema agrícola

**Ruta sugerida:** `/problemas-agricolas`

```text
Problemas agrícolas
│
├── Deficiencia nutricional
│   ├── Nitrógeno
│   ├── Fósforo
│   ├── Potasio
│   ├── Calcio
│   ├── Magnesio
│   ├── Zinc
│   ├── Boro
│   └── Hierro
│
├── Plagas
│   ├── Insectos chupadores
│   ├── Insectos masticadores
│   ├── Ácaros
│   ├── Nematodos
│   └── Larvas
│
├── Enfermedades
│   ├── Hongos
│   ├── Bacterias
│   ├── Virus
│   └── Pudriciones
│
├── Malezas
│   ├── Hoja ancha
│   ├── Gramíneas
│   └── Ciperáceas
│
└── Estrés agrícola
    ├── Sequía
    ├── Salinidad
    ├── Exceso de humedad
    ├── Estrés térmico
    └── Trasplante
```

---

# 4. Marketplace transaccional

## 4.1 Catálogo comercial

**Ruta sugerida:** `/productos`

```text
Catálogo comercial
│
├── Listado de productos
├── Filtros avanzados
├── Ordenar por precio
├── Ordenar por disponibilidad
├── Ordenar por vendedor
├── Ordenar por país
├── Vista por tarjetas
├── Vista por tabla B2B
├── Comparar productos
├── Agregar a favoritos
├── Agregar al carrito
└── Solicitar cotización
```

---

## 4.2 Detalle de producto

**Ruta sugerida:** `/productos/{slug-producto}`

```text
Detalle de producto
│
├── Información comercial
│   ├── Nombre del producto
│   ├── Marca
│   ├── Vendedor
│   ├── Fabricante
│   ├── Precio
│   ├── Precio por volumen
│   ├── Disponibilidad
│   ├── Países disponibles
│   ├── Presentación
│   ├── Unidad de medida
│   └── Cantidad mínima
│
├── Información técnica
│   ├── Categoría
│   ├── Subcategoría
│   ├── Composición
│   ├── Ingrediente activo
│   ├── Nutrientes
│   ├── Formulación
│   ├── Método de aplicación
│   ├── Dosis recomendada
│   ├── Cultivos recomendados
│   ├── Plagas / enfermedades / malezas objetivo
│   └── Compatibilidad
│
├── Información regulatoria
│   ├── Registro por país
│   ├── Estado regulatorio
│   ├── Hoja de seguridad
│   ├── Etiqueta autorizada
│   ├── Certificados
│   ├── Restricciones de uso
│   └── Alertas regulatorias
│
├── Operación comercial
│   ├── Agregar al carrito
│   ├── Comprar ahora
│   ├── Solicitar cotización
│   ├── Solicitar asesoría técnica
│   ├── Descargar ficha técnica
│   └── Contactar vendedor
│
└── Reputación
    ├── Calificación del producto
    ├── Opiniones de compradores
    ├── Calificación del vendedor
    └── Preguntas frecuentes
```

---

## 4.3 Tienda del vendedor

**Ruta sugerida:** `/vendedores/{slug-vendedor}`

```text
Tienda del vendedor
│
├── Perfil comercial
│   ├── Logo
│   ├── Nombre
│   ├── País
│   ├── Descripción
│   ├── Certificaciones
│   ├── Marcas representadas
│   └── Políticas comerciales
│
├── Catálogo del vendedor
│   ├── Productos activos
│   ├── Categorías vendidas
│   ├── Productos por país
│   └── Productos por disponibilidad
│
├── Operación
│   ├── Solicitar cotización al vendedor
│   ├── Contactar vendedor
│   ├── Ver condiciones de entrega
│   └── Ver documentos comerciales
│
└── Reputación
    ├── Calificación general
    ├── Tiempo promedio de respuesta
    ├── Tasa de cumplimiento
    └── Opiniones
```

---

## 4.4 Carrito B2B

**Ruta sugerida:** `/carrito`

```text
Carrito B2B
│
├── Productos seleccionados
├── Cantidades
├── Unidad de medida
├── Precio unitario
├── Descuentos por volumen
├── Impuestos
├── Flete estimado
├── Subtotal por vendedor
├── Total general
├── Productos con restricción
├── Validación regulatoria
├── Continuar comprando
├── Solicitar cotización
└── Ir a checkout
```

---

## 4.5 RFQ / Solicitud de cotización

**Ruta sugerida:** `/rfq/nueva`

```text
Solicitud de cotización RFQ
│
├── Datos del comprador
├── Empresa solicitante
├── País de destino
├── Dirección de entrega
├── Productos solicitados
├── Cantidades
├── Unidad de medida
├── Fecha requerida
├── Condiciones de pago
├── Requisitos técnicos
├── Documentos requeridos
├── Vendedores invitados
├── Observaciones
└── Enviar solicitud
```

---

## 4.6 Comparación de ofertas

**Ruta sugerida:** `/rfq/{id}/ofertas`

```text
Comparación de ofertas
│
├── Oferta por vendedor
├── Precio unitario
├── Precio total
├── Disponibilidad
├── Tiempo de entrega
├── Flete
├── Condiciones de pago
├── Documentos incluidos
├── Validez de la oferta
├── Calificación del vendedor
├── Comparar
├── Negociar
└── Aceptar oferta
```

---

## 4.7 Checkout B2B

**Ruta sugerida:** `/checkout`

```text
Checkout B2B
│
├── Resumen de compra
├── Validación de productos
├── Validación regulatoria
├── Dirección de entrega
├── Método de entrega
├── Método de pago
├── Crédito disponible
├── Datos fiscales
├── Facturación
├── Confirmación de términos
└── Crear orden
```

---

## 4.8 Órdenes

**Ruta sugerida:** `/ordenes`

```text
Órdenes
│
├── Todas las órdenes
├── Pendientes
├── Confirmadas
├── En preparación
├── Despachadas
├── En tránsito
├── Entregadas
├── Canceladas
├── En reclamo
└── Devueltas
```

### Detalle de orden

**Ruta sugerida:** `/ordenes/{id}`

```text
Detalle de orden
│
├── Datos de la orden
├── Comprador
├── Vendedor
├── Productos
├── Cantidades
├── Precios
├── Impuestos
├── Facturas
├── Pagos
├── Documentos técnicos
├── Documentos regulatorios
├── Estado logístico
├── Tracking
├── Prueba de entrega
├── Reclamos
└── Soporte
```

---

# 5. Ecosistema técnico agro

## 5.1 Fertilizantes

**Ruta sugerida:** `/ecosistema/fertilizantes`

```text
Fertilizantes
│
├── Nitrogenados
├── Fosfatados
├── Potásicos
├── NPK
├── NPK solubles
├── Micronutrientes
├── Orgánicos
├── Enmiendas
├── Especialidades
├── Productos por cultivo
├── Productos por etapa
├── Productos por suelo
├── Planes de fertilización
└── Asesoría nutricional
```

---

## 5.2 Biológicos agrícolas

**Ruta sugerida:** `/ecosistema/biologicos`

```text
Biológicos agrícolas
│
├── Biofertilizantes
├── Bioestimulantes
├── Biopesticidas
├── Microorganismos benéficos
├── Productos orgánicos
├── Certificaciones
├── Productos por cultivo
├── Productos por problema
└── Asesoría sostenible
```

---

## 5.3 Protección de cultivos

**Ruta sugerida:** `/ecosistema/proteccion-cultivos`

```text
Protección de cultivos
│
├── Herbicidas
│   ├── Malezas objetivo
│   ├── Cultivos autorizados
│   ├── Ingredientes activos
│   └── Restricciones
│
├── Insecticidas
│   ├── Plagas objetivo
│   ├── Modo de acción
│   ├── Toxicidad
│   └── Restricciones
│
├── Fungicidas
│   ├── Enfermedades objetivo
│   ├── Preventivos
│   ├── Curativos
│   └── Sistémicos
│
├── Acaricidas
├── Nematicidas
└── Reguladores de crecimiento
```

---

## 5.4 Asesoría agronómica

**Ruta sugerida:** `/asesoria-agronomica`

```text
Asesoría agronómica
│
├── Solicitar diagnóstico
├── Diagnóstico por cultivo
├── Diagnóstico por fotos
├── Diagnóstico por suelo
├── Diagnóstico por plaga
├── Diagnóstico por enfermedad
├── Recomendación de productos
├── Plan de fertilización
├── Plan fitosanitario
├── Agenda con experto
└── Historial de consultas
```

---

## 5.5 Expertos regionales

**Ruta sugerida:** `/expertos`

```text
Expertos regionales
│
├── Buscar experto
├── Expertos por país
├── Expertos por cultivo
├── Expertos por categoría
├── Expertos en fertilizantes
├── Expertos en biológicos
├── Expertos en herbicidas
├── Expertos en insecticidas
├── Expertos en fungicidas
├── Agenda de citas
└── Contactar experto
```

---

# 6. Catálogo técnico-regulatorio

## 6.1 Centro regulatorio

**Ruta sugerida:** `/regulatorio`

```text
Centro regulatorio
│
├── Productos regulados
├── Registros por país
├── Autoridades regulatorias
├── Estados regulatorios
├── Documentos obligatorios
├── Restricciones de uso
├── Alertas regulatorias
├── Productos bloqueados
├── Productos pendientes
├── Productos aprobados
├── Productos vencidos
└── Auditoría documental
```

---

## 6.2 FUR Producto

**Ruta sugerida:** `/regulatorio/fur-producto/{id}`

```text
FUR Producto
│
├── Datos comerciales
│   ├── Nombre
│   ├── Marca
│   ├── Fabricante
│   ├── Vendedor
│   ├── Categoría
│   └── Presentación
│
├── Datos técnicos
│   ├── Composición
│   ├── Ingrediente activo
│   ├── Nutrientes
│   ├── Concentración
│   ├── Formulación
│   ├── Método de aplicación
│   ├── Dosis
│   └── Compatibilidad
│
├── Datos regulatorios
│   ├── País
│   ├── Autoridad
│   ├── Número de registro
│   ├── Estado
│   ├── Vigencia
│   ├── Restricciones
│   └── Documentos
│
├── Datos logísticos
│   ├── Unidad de medida
│   ├── Empaque
│   ├── Peso
│   ├── Volumen
│   ├── Almacenamiento
│   └── Transporte
│
└── Historial
    ├── Versiones
    ├── Aprobaciones
    ├── Rechazos
    ├── Cambios
    └── Responsable
```

---

## 6.3 Biblioteca documental regulatoria

**Ruta sugerida:** `/regulatorio/documentos`

```text
Documentos regulatorios
│
├── Fichas técnicas
├── Hojas de seguridad SDS/MSDS
├── Etiquetas autorizadas
├── Certificados de calidad
├── Certificados de origen
├── Certificados orgánicos
├── Certificados fitosanitarios
├── Registros oficiales
├── Permisos de comercialización
├── Documentos de transporte
├── Documentos por lote
└── Versiones documentales
```

---

# 7. Operación empresarial B2B

## 7.1 Empresas

**Ruta sugerida:** `/b2b/empresas`

```text
Empresas
│
├── Empresas compradoras
├── Empresas proveedoras
├── Fabricantes
├── Distribuidores
├── Operadores logísticos
├── Laboratorios
├── Asesores
├── Representantes
├── Documentos empresariales
├── Validación empresarial
└── Estado de aprobación
```

---

## 7.2 Cuenta corporativa

**Ruta sugerida:** `/b2b/cuenta-corporativa`

```text
Cuenta corporativa
│
├── Perfil de empresa
├── Usuarios corporativos
├── Roles internos
├── Permisos
├── Sedes
├── Fincas
├── Sucursales
├── Centros de costo
├── Direcciones de entrega
├── Datos fiscales
├── Métodos de pago
└── Documentos legales
```

---

## 7.3 Aprobaciones internas

**Ruta sugerida:** `/b2b/aprobaciones`

```text
Aprobaciones internas
│
├── Solicitudes pendientes
├── Solicitudes aprobadas
├── Solicitudes rechazadas
├── Reglas de aprobación
├── Aprobación por monto
├── Aprobación por producto
├── Aprobación por proveedor
├── Aprobación por centro de costo
├── Aprobación por crédito
└── Historial de aprobación
```

---

## 7.4 Contratos marco

**Ruta sugerida:** `/b2b/contratos`

```text
Contratos marco
│
├── Contratos activos
├── Contratos vencidos
├── Nuevo contrato
├── Comprador
├── Vendedor
├── Productos incluidos
├── Precios pactados
├── Volúmenes pactados
├── Condiciones de pago
├── Condiciones de entrega
├── Vigencia
├── Documentos
└── Renovación
```

---

## 7.5 Crédito B2B

**Ruta sugerida:** `/b2b/credito`

```text
Crédito B2B
│
├── Solicitud de crédito
├── Evaluación de riesgo
├── Cupo aprobado
├── Cupo disponible
├── Cupo usado
├── Cupo bloqueado
├── Condiciones de pago
├── Vencimientos
├── Cobranza
├── Garantías
├── Historial de pagos
└── Estado crediticio
```

---

# 8. Dashboards por perfil

## 8.1 Dashboard comprador agro

**Ruta sugerida:** `/dashboard/comprador`

```text
Dashboard comprador agro
│
├── Resumen
├── Buscar productos
├── Catálogo
├── Carrito
├── Cotizaciones RFQ
├── Ofertas recibidas
├── Órdenes
├── Pagos
├── Facturas
├── Crédito
├── Tracking
├── Asesoría agronómica
├── Documentos técnicos
├── Reclamos
├── Devoluciones
└── Soporte
```

---

## 8.2 Dashboard comprador corporativo

**Ruta sugerida:** `/dashboard/comprador-corporativo`

```text
Dashboard comprador corporativo
│
├── Resumen ejecutivo
├── Usuarios de empresa
├── Sedes / fincas
├── Centros de costo
├── Aprobaciones internas
├── Contratos marco
├── Catálogo privado
├── Compras recurrentes
├── Órdenes corporativas
├── Crédito B2B
├── Facturación
├── Reportes de compras
├── Reportes financieros
└── Integración ERP
```

---

## 8.3 Dashboard vendedor

**Ruta sugerida:** `/dashboard/vendedor`

```text
Dashboard vendedor
│
├── Resumen de ventas
├── Perfil de tienda
├── Productos publicados
├── Crear producto
├── Precios
├── Inventario
├── Lotes y vencimientos
├── Documentos técnicos
├── Documentos regulatorios
├── Cotizaciones recibidas
├── Ofertas enviadas
├── Órdenes recibidas
├── Despachos
├── Reclamos
├── Comisiones
├── Liquidaciones
├── Reviews
└── Reportes
```

---

## 8.4 Dashboard fabricante / marca

**Ruta sugerida:** `/dashboard/fabricante`

```text
Dashboard fabricante
│
├── Resumen de marca
├── Líneas de producto
├── Productos fabricados
├── Distribuidores autorizados
├── Vendedores autorizados
├── Registros por país
├── Documentos maestros
├── Certificados
├── Ventas por país
├── Ventas por distribuidor
├── Demanda de mercado
├── Reclamos de calidad
└── Reportes
```

---

## 8.5 Dashboard distribuidor autorizado

**Ruta sugerida:** `/dashboard/distribuidor`

```text
Dashboard distribuidor autorizado
│
├── Territorio asignado
├── Productos autorizados
├── Marcas representadas
├── Clientes regionales
├── Cotizaciones regionales
├── Órdenes regionales
├── Inventario local
├── Despachos
├── Soporte regional
├── Ventas
└── Reportes
```

---

## 8.6 Dashboard asesor agronómico

**Ruta sugerida:** `/dashboard/asesor`

```text
Dashboard asesor agronómico
│
├── Consultas técnicas
├── Diagnósticos pendientes
├── Diagnósticos cerrados
├── Planes de fertilización
├── Planes fitosanitarios
├── Recomendaciones emitidas
├── Cultivos atendidos
├── Biblioteca técnica
├── Agenda de visitas
├── Seguimiento de casos
└── Reportes técnicos
```

---

## 8.7 Dashboard regulatorio

**Ruta sugerida:** `/dashboard/regulatorio`

```text
Dashboard regulatorio
│
├── Productos pendientes de aprobación
├── Productos aprobados
├── Productos bloqueados
├── Registros por país
├── Documentos pendientes
├── Documentos vencidos
├── Hojas de seguridad
├── Etiquetas autorizadas
├── Certificados
├── Restricciones
├── Alertas regulatorias
├── Auditoría documental
└── Reportes regulatorios
```

---

## 8.8 Dashboard logístico

**Ruta sugerida:** `/dashboard/logistica`

```text
Dashboard logístico
│
├── Órdenes por despachar
├── Órdenes en tránsito
├── Rutas
├── Operadores logísticos
├── Cotización de flete
├── Tracking
├── Pruebas de entrega
├── Incidencias
├── Devoluciones
├── Documentos de transporte
└── Reportes logísticos
```

---

## 8.9 Dashboard financiero

**Ruta sugerida:** `/dashboard/finanzas`

```text
Dashboard financiero
│
├── Pagos recibidos
├── Pagos pendientes
├── Facturas
├── Conciliaciones
├── Comisiones
├── Liquidaciones a vendedores
├── Reembolsos
├── Retenciones
├── Impuestos
├── Cuentas por cobrar
├── Cuentas por pagar
└── Reportes financieros
```

---

## 8.10 Dashboard administrador

**Ruta sugerida:** `/admin`

```text
Dashboard administrador
│
├── Resumen global
├── Usuarios
├── Empresas
├── Compradores
├── Vendedores
├── Fabricantes
├── Distribuidores
├── Productos
├── Categorías
├── Documentos
├── Registros regulatorios
├── Órdenes
├── Pagos
├── Facturas
├── Comisiones
├── Liquidaciones
├── Reclamos
├── Logística
├── Marketing
├── SEO
├── Reportes
├── Configuración
└── Auditoría
```

---

# 9. Administración global

## 9.1 Configuración del marketplace

**Ruta sugerida:** `/admin/configuracion`

```text
Configuración
│
├── General
│   ├── Nombre de plataforma
│   ├── Logo
│   ├── Idiomas
│   ├── Monedas
│   └── Países activos
│
├── Marketplace
│   ├── Comisiones
│   ├── Reglas de publicación
│   ├── Reglas de vendedores
│   ├── Reglas de compradores
│   ├── Estados de órdenes
│   └── Políticas de devolución
│
├── B2B
│   ├── Reglas de crédito
│   ├── Reglas de aprobación
│   ├── Contratos
│   ├── Centros de costo
│   └── Compras recurrentes
│
├── Regulatorio
│   ├── Autoridades
│   ├── Documentos obligatorios
│   ├── Estados regulatorios
│   ├── Restricciones
│   └── Alertas
│
├── Logística
│   ├── Operadores
│   ├── Tarifas
│   ├── Zonas
│   ├── Rutas
│   └── Tracking
│
└── Integraciones
    ├── Odoo
    ├── Pasarela de pago
    ├── Bancos
    ├── Facturación
    ├── WhatsApp
    ├── Email
    ├── SMS
    ├── Mapas
    └── Clima
```

---

# 10. Biblioteca técnica agro

**Ruta sugerida:** `/biblioteca`

```text
Biblioteca técnica
│
├── Manuales
├── Fichas técnicas
├── Hojas de seguridad
├── Etiquetas
├── Certificados
├── Guías de aplicación
├── Guías por cultivo
├── Guías por categoría
├── Videos técnicos
├── Casos de uso
├── Artículos técnicos
├── Noticias agro
├── Tendencias del mercado
└── Preguntas frecuentes
```

---

# 11. Noticias agro y contenido SEO

**Ruta sugerida:** `/blog`

```text
Noticias agro
│
├── Fertilizantes
├── Biológicos
├── Protección de cultivos
├── Regulación agro
├── Mercado agrícola
├── Innovación agro
├── Logística agro
├── Crédito agrícola
├── Casos de éxito
├── Guías de compra
└── Actualizaciones del marketplace
```

---

# 12. URLs principales recomendadas

| Sección               | URL sugerida                |
| --------------------- | --------------------------- |
| Inicio                | `/`                         |
| Buscar productos      | `/buscar`                   |
| Catálogo              | `/productos`                |
| Categorías            | `/categorias`               |
| Fertilizantes         | `/categorias/fertilizantes` |
| Biológicos            | `/categorias/biologicos`    |
| Herbicidas            | `/categorias/herbicidas`    |
| Insecticidas          | `/categorias/insecticidas`  |
| Fungicidas            | `/categorias/fungicidas`    |
| Semillas              | `/categorias/semillas`      |
| Producto detalle      | `/productos/{slug}`         |
| Tienda vendedor       | `/vendedores/{slug}`        |
| Países                | `/paises`                   |
| Productos por país    | `/paises/{pais}`            |
| Cultivos              | `/cultivos`                 |
| Cultivo detalle       | `/cultivos/{cultivo}`       |
| Problemas agrícolas   | `/problemas-agricolas`      |
| Asesoría agronómica   | `/asesoria-agronomica`      |
| Expertos              | `/expertos`                 |
| Biblioteca técnica    | `/biblioteca`               |
| Blog / noticias       | `/blog`                     |
| Carrito               | `/carrito`                  |
| RFQ                   | `/rfq`                      |
| Nueva RFQ             | `/rfq/nueva`                |
| Checkout              | `/checkout`                 |
| Órdenes               | `/ordenes`                  |
| Detalle de orden      | `/ordenes/{id}`             |
| Login                 | `/login`                    |
| Registro              | `/registro`                 |
| Registro comprador    | `/registro/comprador`       |
| Registro vendedor     | `/registro/vendedor`        |
| Registro fabricante   | `/registro/fabricante`      |
| Registro distribuidor | `/registro/distribuidor`    |
| Dashboard comprador   | `/dashboard/comprador`      |
| Dashboard vendedor    | `/dashboard/vendedor`       |
| Dashboard fabricante  | `/dashboard/fabricante`     |
| Dashboard asesor      | `/dashboard/asesor`         |
| Dashboard regulatorio | `/dashboard/regulatorio`    |
| Dashboard logística   | `/dashboard/logistica`      |
| Dashboard finanzas    | `/dashboard/finanzas`       |
| Administración        | `/admin`                    |
| Configuración         | `/admin/configuracion`      |

---

# 13. Menú principal recomendado

```text
MENÚ PRINCIPAL
│
├── Inicio
├── Comprar
│   ├── Catálogo
│   ├── Fertilizantes
│   ├── Biológicos
│   ├── Herbicidas
│   ├── Insecticidas
│   ├── Fungicidas
│   ├── Semillas
│   └── Servicios agrícolas
│
├── Cotizar
│   ├── Nueva RFQ
│   ├── Cotizar por volumen
│   ├── Cotizar por cultivo
│   └── Cotizar por país
│
├── Ecosistema Agro
│   ├── Cultivos
│   ├── Plagas
│   ├── Enfermedades
│   ├── Planes de fertilización
│   ├── Planes fitosanitarios
│   ├── Expertos regionales
│   └── Asesoría agronómica
│
├── Catálogo Regulatorio
│   ├── Fichas técnicas
│   ├── Hojas de seguridad
│   ├── Certificados
│   ├── Registros por país
│   └── Restricciones
│
├── B2B
│   ├── Compradores corporativos
│   ├── Contratos marco
│   ├── Crédito B2B
│   ├── Compras recurrentes
│   └── Integración ERP
│
├── Vender
│   ├── Registrar vendedor
│   ├── Registrar fabricante
│   ├── Registrar distribuidor
│   └── Beneficios para proveedores
│
├── Biblioteca
├── Blog
└── Contacto
```

---

# 14. Footer recomendado

```text
FOOTER
│
├── Marketplace Agro
│   ├── Sobre nosotros
│   ├── Cómo funciona
│   ├── Comprar en el marketplace
│   ├── Vender en el marketplace
│   └── Preguntas frecuentes
│
├── Categorías
│   ├── Fertilizantes
│   ├── Biológicos
│   ├── Herbicidas
│   ├── Insecticidas
│   ├── Fungicidas
│   └── Semillas
│
├── Ecosistema Agro
│   ├── Cultivos
│   ├── Expertos regionales
│   ├── Asesoría agronómica
│   ├── Biblioteca técnica
│   └── Noticias agro
│
├── B2B
│   ├── Compradores corporativos
│   ├── Crédito B2B
│   ├── Contratos marco
│   ├── Integración ERP
│   └── Soporte empresarial
│
├── Legal
│   ├── Términos y condiciones
│   ├── Política de privacidad
│   ├── Política de devoluciones
│   ├── Política de vendedores
│   ├── Política regulatoria
│   └── Uso de productos regulados
│
└── Contacto
    ├── Formulario
    ├── WhatsApp
    ├── Email
    ├── Soporte
    └── Redes sociales
```

---

# 15. Mapa del sitio por tipo de usuario

## 15.1 Visitante público

```text
Visitante público
│
├── Inicio
├── Catálogo
├── Categorías
├── Productos por país
├── Productos por cultivo
├── Biblioteca técnica
├── Expertos
├── Blog
├── Registro
└── Contacto
```

## 15.2 Comprador agro

```text
Comprador agro
│
├── Dashboard comprador
├── Catálogo
├── Carrito
├── RFQ
├── Órdenes
├── Pagos
├── Facturas
├── Tracking
├── Crédito
├── Asesoría
├── Soporte
└── Perfil
```

## 15.3 Vendedor

```text
Vendedor
│
├── Dashboard vendedor
├── Mi tienda
├── Productos
├── Precios
├── Inventario
├── Documentos
├── Cotizaciones
├── Órdenes
├── Despachos
├── Liquidaciones
├── Reclamos
├── Reviews
└── Reportes
```

## 15.4 Comprador corporativo

```text
Comprador corporativo
│
├── Dashboard corporativo
├── Usuarios de empresa
├── Sedes / fincas
├── Centros de costo
├── Aprobaciones
├── Contratos
├── Compras recurrentes
├── Crédito
├── Reportes
└── Integración ERP
```

## 15.5 Administrador

```text
Administrador
│
├── Dashboard administrador
├── Usuarios
├── Empresas
├── Productos
├── Categorías
├── Regulatorio
├── Órdenes
├── Pagos
├── Comisiones
├── Liquidaciones
├── Logística
├── Soporte
├── Marketing
├── Reportes
├── Configuración
└── Auditoría
```

---

# 16. Dictamen final del mapa del sitio

El mapa del sitio del **Marketplace Agro** debe organizarse como un sistema operativo agroindustrial en línea, no como una tienda simple.

La estructura debe integrar cuatro grandes dimensiones:

| Dimensión                    | Función                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Marketplace transaccional    | Comprar, vender, cotizar, pagar, facturar, entregar y calificar.                                          |
| Ecosistema técnico agro      | Gestionar cultivos, productos, expertos, planes técnicos, sourcing y distribución.                        |
| Catálogo técnico-regulatorio | Controlar fichas, registros, hojas de seguridad, etiquetas, certificados y restricciones.                 |
| Operación empresarial B2B    | Manejar empresas, contratos, crédito, aprobaciones, compras recurrentes, reportes e integración ERP/Odoo. |

Con esta arquitectura, el marketplace puede soportar operaciones agroindustriales complejas: múltiples vendedores, productos regulados, compras por volumen, crédito comercial, logística, asesoría agronómica, validaciones regulatorias, compradores corporativos y operación empresarial integrada.

---

# 19. Dictamen final

Este documento maestro define el **mapa del sitio rector** para desarrollar un Marketplace Agro completo. La arquitectura propuesta permite integrar en una sola plataforma:

- Venta transaccional de agroinsumos.
- Cotizaciones B2B por volumen.
- Múltiples vendedores y tiendas.
- Fichas técnicas, documentos y registros por país.
- Productos regulados con validación de cumplimiento.
- Compradores corporativos con aprobaciones, contratos y crédito.
- Asesoría agronómica, expertos regionales y planes técnicos.
- Logística, tracking, reclamos y garantías.
- Administración global, auditoría e integración ERP/Odoo.

El resultado es una plataforma agroindustrial integral: **Marketplace + Ecosistema técnico agro + Catálogo regulatorio + Operación empresarial B2B**.
