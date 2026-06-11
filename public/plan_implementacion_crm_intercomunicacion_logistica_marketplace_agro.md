# PLAN DE IMPLEMENTACIÓN — CRM, INTERCOMUNICACIÓN MULTIACTOR Y LOGÍSTICA COLABORATIVA

## Marketplace Agro

**Versión:** 1.0  
**Tipo de documento:** Plan técnico-funcional de implementación  
**Formato:** Markdown `.md`  
**Objetivo:** Incorporar al Marketplace Agro un CRM transversal, mensajería entre actores y un sistema de contratación logística que permita utilizar transporte propio o contratar operadores logísticos dentro de la plataforma.

---

# 1. Propósito

El Marketplace Agro debe evolucionar desde una plataforma de compra y venta hacia un sistema comercial colaborativo en el que compradores, productores, vendedores, representantes, asesores, almacenes, transportistas y administradores puedan comunicarse y coordinar una operación completa.

La nueva solución debe permitir que una empresa productora o vendedora:

1. Registre y gestione clientes, contactos, oportunidades y actividades comerciales.
2. Converse con compradores antes, durante y después de una operación.
3. Vincule conversaciones con productos, cotizaciones, RFQ, órdenes, contratos y despachos.
4. Pregunte al comprador si posee transporte o requiere logística.
5. Ofrezca su propia flota.
6. Solicite cotizaciones a empresas logísticas registradas en el marketplace.
7. Compare ofertas de transporte.
8. Contrate un operador logístico.
9. Realice seguimiento del despacho.
10. Mantenga trazabilidad comercial, financiera y logística en una sola operación.

---

# 2. Alcance de la ampliación

La implementación se divide en tres componentes principales:

| Componente | Objetivo |
|---|---|
| CRM comercial | Gestionar empresas, contactos, leads, oportunidades, actividades, pipeline, cotizaciones y seguimiento. |
| Intercomunicación multiactor | Permitir conversaciones, archivos, notificaciones, tareas y acuerdos vinculados a cada operación. |
| Marketplace logístico | Permitir transporte propio, transporte del comprador o contratación de operadores logísticos externos. |

Estos componentes deben integrarse con catálogo, RFQ, carrito, checkout, órdenes, contratos B2B, crédito, inventario, almacenes, facturación, pagos, tracking, reclamos, ERP/Odoo y auditoría.

---

# 3. Principios funcionales

| Principio | Aplicación |
|---|---|
| Conversación vinculada al negocio | Toda comunicación debe relacionarse con una empresa, oportunidad, RFQ, orden, contrato o despacho. |
| Un solo hilo por operación | La información comercial y logística no debe dispersarse en chats independientes sin contexto. |
| Elección logística explícita | Toda orden física debe registrar quién gestiona el transporte. |
| Neutralidad logística | El sistema debe aceptar transporte del comprador, del vendedor o de un tercero. |
| Cotización competitiva | Los operadores logísticos pueden presentar ofertas de flete. |
| Trazabilidad completa | Mensajes, decisiones, precios, documentos, estados y responsables deben auditarse. |
| Separación de permisos | Cada actor solo puede acceder a la información que le corresponde. |
| Integración transaccional | Una conversación debe poder generar una tarea, cotización, RFQ, orden, despacho o reclamo. |
| Configuración multipaís | Tarifas, impuestos, restricciones, documentos y transportistas deben configurarse por país. |

---

# 4. Nuevos módulos funcionales

## 4.1 CRM comercial

### Submódulos

1. Empresas y cuentas.
2. Contactos.
3. Leads.
4. Oportunidades.
5. Pipeline de ventas.
6. Actividades y tareas.
7. Agenda comercial.
8. Notas y archivos.
9. Cotizaciones comerciales.
10. Historial de compras.
11. Segmentación de clientes.
12. Campañas y seguimiento.
13. Representantes comerciales.
14. Reportes CRM.
15. Integración con RFQ, órdenes y contratos.

### Estados sugeridos de oportunidad

```text
Nuevo lead
→ Contactado
→ Necesidad identificada
→ Oferta en preparación
→ Cotización enviada
→ Negociación
→ Validación logística
→ Aprobación del cliente
→ Ganada
→ Perdida
→ Posventa
```

### Campos principales de oportunidad

| Campo | Descripción |
|---|---|
| Empresa cliente | Comprador relacionado. |
| Contacto principal | Persona responsable. |
| Vendedor o representante | Responsable comercial. |
| Productos de interés | Café, fertilizantes, semillas, maquinaria u otros. |
| Cantidad estimada | Volumen solicitado. |
| Valor estimado | Monto potencial. |
| País y lugar de entrega | Destino comercial y logístico. |
| Fecha requerida | Fecha esperada de entrega. |
| Necesita transporte | Sí, no o pendiente de confirmar. |
| Modalidad logística | Comprador, vendedor o tercero. |
| Probabilidad | Estimación comercial. |
| Próxima actividad | Llamada, mensaje, visita, cotización o seguimiento. |
| Estado | Etapa del pipeline. |

## 4.2 Intercomunicación multiactor

### Objetivo

Crear un centro de comunicación interno que permita a todos los actores autorizados coordinar una operación sin salir del marketplace.

### Tipos de conversación

| Tipo | Participantes |
|---|---|
| Consulta precompra | Comprador y vendedor. |
| Conversación de oportunidad | Cliente, vendedor y representante comercial. |
| Conversación RFQ | Comprador y vendedores invitados. |
| Conversación de orden | Comprador, vendedor y soporte. |
| Conversación logística | Comprador, vendedor, almacén y operador logístico. |
| Conversación regulatoria | Vendedor, fabricante y analista regulatorio. |
| Conversación técnica | Comprador y asesor agronómico. |
| Conversación de reclamo | Comprador, vendedor, soporte y logística. |
| Conversación interna | Usuarios autorizados de una misma empresa. |

### Funcionalidades

- Chat en tiempo real o mensajería asincrónica.
- Mensajes internos entre usuarios de una empresa.
- Conversaciones externas entre empresas.
- Adjuntos, imágenes y documentos.
- Notas privadas.
- Menciones y respuestas por hilo.
- Confirmación de lectura.
- Búsqueda e historial.
- Plantillas de mensajes.
- Notificaciones por correo, WhatsApp o push.
- Conversión de mensaje en tarea.
- Conversión de mensaje en oportunidad.
- Conversión de conversación en RFQ.
- Creación de incidencia desde el chat.
- Registro de acuerdos.
- Protección de datos sensibles por rol.

### Regla central

Cada conversación debe tener al menos uno de los siguientes vínculos:

```text
Empresa
Contacto
Lead
Oportunidad
Producto
RFQ
Oferta
Orden
Contrato
Despacho
Factura
Reclamo
Consulta técnica
```

## 4.3 Marketplace logístico

### Modalidades disponibles

| Modalidad | Responsable |
|---|---|
| Retiro por el comprador | El cliente utiliza su propia flota o transportista. |
| Entrega con flota del vendedor | La empresa vendedora utiliza vehículos propios. |
| Logística contratada por el vendedor | El vendedor solicita y contrata un operador dentro de la plataforma. |
| Logística contratada por el comprador | El comprador selecciona un operador registrado. |
| Logística coordinada por el marketplace | La plataforma asigna o recomienda operadores según reglas. |

### Submódulos

1. Perfil de operador logístico.
2. Flotas.
3. Vehículos.
4. Conductores.
5. Zonas de cobertura.
6. Tipos de carga.
7. Capacidades.
8. Tarifas.
9. Solicitudes de flete.
10. Ofertas logísticas.
11. Comparador de fletes.
12. Reserva de transporte.
13. Programación de retiro.
14. Documentos de transporte.
15. Tracking.
16. Incidencias.
17. Prueba de entrega.
18. Liquidación al transportista.
19. Reputación logística.
20. Reportes.

---

# 5. Flujo comercial y logístico de referencia: venta de café

## 5.1 Escenario

Una empresa productora o vendedora publica café. Un comprador realiza una compra o acepta una cotización. Antes de cerrar la entrega, el sistema debe confirmar cómo se realizará el transporte.

## 5.2 Flujo propuesto

```text
1. El comprador selecciona café.
2. El comprador indica cantidad, presentación y lugar de entrega.
3. El sistema crea carrito, RFQ u oportunidad CRM.
4. El vendedor revisa la solicitud.
5. El sistema pregunta: “¿Quién gestionará el transporte?”
6. El comprador selecciona una opción:
   A. Retiro con transporte propio.
   B. Entrega con transporte del vendedor.
   C. Solicitar ofertas a operadores logísticos.
7. Si el comprador posee transporte:
   → Registra transportista, vehículo, conductor y fecha de retiro.
8. Si el vendedor ofrece su flota:
   → Calcula disponibilidad, capacidad, ruta, fecha y tarifa.
9. Si se requiere un tercero:
   → Se crea una Solicitud de Flete.
   → Se invitan operadores compatibles.
   → Los operadores presentan ofertas.
   → Comprador o vendedor compara precio, tiempo, cobertura y reputación.
   → Se acepta una oferta.
10. El costo logístico se agrega a la orden o se factura por separado.
11. Se programa el retiro.
12. El almacén prepara la carga.
13. El transportista confirma recepción.
14. Se activa tracking.
15. El cliente recibe la mercancía.
16. Se carga prueba de entrega.
17. Se cierra el despacho.
18. El sistema registra la experiencia en CRM.
19. Se habilita calificación del vendedor y del operador logístico.
```

---

# 6. Pregunta logística obligatoria

Antes de confirmar una orden que requiera transporte, la plataforma debe mostrar:

## ¿Cómo desea gestionar la logística?

### Opción A — Tengo transporte propio

Campos mínimos:

- Empresa transportista.
- Conductor.
- Documento del conductor.
- Placa.
- Tipo y capacidad del vehículo.
- Fecha y hora de retiro.
- Teléfono.
- Seguro o documento requerido.
- Observaciones.

### Opción B — Deseo usar la flota del vendedor

El sistema debe mostrar:

- Vehículos disponibles.
- Capacidad.
- Fecha disponible.
- Zona de cobertura.
- Tarifa.
- Tiempo estimado.
- Condiciones.
- Seguro.
- Responsable.

### Opción C — Solicitar transporte en el marketplace

El sistema debe generar automáticamente una solicitud de flete con:

- Origen y destino.
- Producto y tipo de carga.
- Peso, volumen y bultos.
- Condiciones especiales.
- Fecha de retiro.
- Fecha requerida de entrega.
- Documentos.
- Seguro requerido.
- Tipo de vehículo.
- Observaciones.

---

# 7. Pantallas nuevas requeridas

## 7.1 Pantallas CRM

| Código | Pantalla | Ruta sugerida | Acceso |
|---|---|---|---|
| CRM-01 | Dashboard CRM | `/dashboard/crm` | Privado |
| CRM-02 | Empresas y cuentas | `/crm/empresas` | Privado |
| CRM-03 | Contactos | `/crm/contactos` | Privado |
| CRM-04 | Leads | `/crm/leads` | Privado |
| CRM-05 | Oportunidades | `/crm/oportunidades` | Privado |
| CRM-06 | Pipeline Kanban | `/crm/pipeline` | Privado |
| CRM-07 | Detalle de oportunidad | `/crm/oportunidades/{id}` | Privado |
| CRM-08 | Actividades | `/crm/actividades` | Privado |
| CRM-09 | Agenda | `/crm/agenda` | Privado |
| CRM-10 | Historial del cliente | `/crm/clientes/{id}/historial` | Privado |
| CRM-11 | Segmentos | `/crm/segmentos` | Privado |
| CRM-12 | Reportes CRM | `/crm/reportes` | Privado |

## 7.2 Pantallas de comunicación

| Código | Pantalla | Ruta sugerida | Acceso |
|---|---|---|---|
| COM-01 | Centro de conversaciones | `/mensajes` | Privado |
| COM-02 | Conversación | `/mensajes/{id}` | Privado |
| COM-03 | Nueva conversación | `/mensajes/nueva` | Privado |
| COM-04 | Participantes | `/mensajes/{id}/participantes` | Privado |
| COM-05 | Archivos compartidos | `/mensajes/{id}/archivos` | Privado |
| COM-06 | Tareas de conversación | `/mensajes/{id}/tareas` | Privado |
| COM-07 | Notificaciones | `/notificaciones` | Privado |
| COM-08 | Preferencias de comunicación | `/configuracion/notificaciones` | Privado |

## 7.3 Pantallas logísticas

| Código | Pantalla | Ruta sugerida | Acceso |
|---|---|---|---|
| LOG-01 | Selección de modalidad logística | `/checkout/logistica` | Privado |
| LOG-02 | Transporte propio del comprador | `/logistica/transporte-comprador` | Privado |
| LOG-03 | Flota del vendedor | `/logistica/flota-vendedor` | Privado |
| LOG-04 | Nueva solicitud de flete | `/logistica/solicitudes/nueva` | Privado |
| LOG-05 | Solicitudes de flete | `/logistica/solicitudes` | Privado |
| LOG-06 | Detalle de solicitud | `/logistica/solicitudes/{id}` | Privado |
| LOG-07 | Ofertas logísticas | `/logistica/solicitudes/{id}/ofertas` | Privado |
| LOG-08 | Comparador de fletes | `/logistica/solicitudes/{id}/comparar` | Privado |
| LOG-09 | Reserva de transporte | `/logistica/reservas/{id}` | Privado |
| LOG-10 | Flota | `/logistica/flota` | Privado |
| LOG-11 | Vehículos | `/logistica/vehiculos` | Privado |
| LOG-12 | Conductores | `/logistica/conductores` | Privado |
| LOG-13 | Programación de retiro | `/logistica/retiros/{id}` | Privado |
| LOG-14 | Tracking | `/tracking/{id}` | Privado / enlace controlado |
| LOG-15 | Prueba de entrega | `/logistica/entregas/{id}` | Privado |
| LOG-16 | Incidencias | `/logistica/incidencias` | Privado |
| LOG-17 | Liquidaciones logísticas | `/logistica/liquidaciones` | Privado |
| LOG-18 | Reputación del operador | `/logistica/operadores/{id}/reviews` | Público / privado |

---

# 8. Roles y permisos

| Rol | Funciones CRM | Comunicación | Logística |
|---|---|---|---|
| Comprador | Consulta historial, solicitudes y órdenes. | Conversa con vendedor, asesor, soporte y logística. | Define modalidad, solicita flete y consulta tracking. |
| Comprador corporativo | Gestiona cuentas, aprobaciones y contratos. | Conversaciones empresariales y por orden. | Aprueba costos de transporte y operadores. |
| Vendedor / productor | Gestiona clientes, leads, oportunidades y pipeline. | Contacta compradores y actores internos. | Ofrece flota o solicita operadores externos. |
| Representante comercial | Gestiona leads, agenda y seguimiento. | Contacta clientes y coordina áreas internas. | Solicita validación logística y da seguimiento. |
| Operador logístico | Gestiona solicitudes y ofertas de flete. | Conversa en hilos logísticos autorizados. | Gestiona flota, retiro, tracking y entrega. |
| Encargado de almacén | Consulta órdenes y tareas. | Coordina carga con vendedor y transportista. | Confirma picking, carga y entrega al conductor. |
| Finanzas | Consulta oportunidades ganadas y órdenes. | Solicita información financiera. | Valida costos, facturas y liquidaciones. |
| Soporte | Accede a casos autorizados. | Interviene en reclamos e incidencias. | Gestiona problemas de transporte. |
| Administrador | Visión global y configuración. | Audita según política. | Configura reglas, comisiones y operadores. |
| Superadministrador | Gobierno global. | Configuración y seguridad. | Parámetros globales e integraciones. |

---

# 9. Modelo de datos mínimo

## 9.1 Entidades CRM

- `crm_account`
- `crm_contact`
- `crm_lead`
- `crm_opportunity`
- `crm_pipeline_stage`
- `crm_activity`
- `crm_task`
- `crm_note`
- `crm_tag`
- `crm_campaign`
- `crm_opportunity_product`
- `crm_opportunity_history`

## 9.2 Entidades de comunicación

- `conversation`
- `conversation_participant`
- `conversation_message`
- `conversation_attachment`
- `conversation_reference`
- `conversation_task`
- `message_read_status`
- `notification`
- `notification_preference`
- `message_template`

## 9.3 Entidades logísticas

- `logistics_provider`
- `fleet`
- `vehicle`
- `driver`
- `coverage_zone`
- `freight_request`
- `freight_request_item`
- `freight_offer`
- `freight_booking`
- `pickup_schedule`
- `shipment`
- `shipment_event`
- `proof_of_delivery`
- `logistics_incident`
- `logistics_document`
- `logistics_settlement`
- `logistics_review`

---

# 10. Estados funcionales

## 10.1 Solicitud de flete

```text
Borrador
→ Publicada
→ Operadores invitados
→ Ofertas recibidas
→ En comparación
→ Oferta seleccionada
→ Reservada
→ Programada
→ En retiro
→ En tránsito
→ Entregada
→ Cerrada
→ Cancelada
→ En incidencia
```

## 10.2 Oferta logística

```text
Borrador
→ Enviada
→ Vista
→ En negociación
→ Aceptada
→ Rechazada
→ Vencida
→ Cancelada
```

## 10.3 Conversación

```text
Abierta
→ En seguimiento
→ Esperando respuesta
→ Resuelta
→ Cerrada
→ Reabierta
```

---

# 11. Reglas de negocio

1. Toda orden física debe tener una modalidad logística definida.
2. No se puede programar un despacho sin origen, destino, fecha y responsable.
3. Si el comprador retira la mercancía, debe registrar datos mínimos del transportista.
4. La flota del vendedor solo puede ofrecerse si existe capacidad y cobertura.
5. Un operador externo solo puede ofertar si está validado y activo.
6. Las ofertas deben indicar precio, vigencia, vehículo, capacidad y tiempo estimado.
7. El sistema debe impedir aceptar ofertas vencidas.
8. La oferta aceptada debe generar una reserva logística.
9. El costo logístico debe definir quién lo paga.
10. Se debe diferenciar precio del producto, flete, seguro, impuestos y servicios adicionales.
11. La conversación logística debe incluir únicamente actores autorizados.
12. Los mensajes internos de una empresa no deben ser visibles para otras empresas.
13. Todo cambio de tarifa o condición debe quedar auditado.
14. El tracking debe registrar eventos con fecha, usuario y ubicación cuando aplique.
15. La prueba de entrega debe contener receptor, fecha y evidencia.
16. Una incidencia logística debe vincularse a la orden y al despacho.
17. La reputación logística solo puede emitirse después de una entrega cerrada.
18. La oportunidad CRM debe actualizarse automáticamente cuando se genera una orden.
19. Una orden entregada debe crear una actividad de posventa.
20. La información sensible debe protegerse por rol y empresa.

---

# 12. Integración con módulos existentes

| Módulo existente | Integración requerida |
|---|---|
| Catálogo | Crear leads y oportunidades desde consultas de producto. |
| Producto | Iniciar conversación con vendedor. |
| RFQ comercial | Crear oportunidad y conversación. |
| Ofertas | Generar actividad de seguimiento. |
| Carrito | Preguntar modalidad logística. |
| Checkout | Calcular y confirmar transporte. |
| Órdenes | Crear conversación y despacho. |
| Inventario | Validar disponibilidad para carga. |
| Almacén | Programar picking y retiro. |
| Facturación | Incluir o separar costo logístico. |
| Pagos | Cobrar producto, flete y seguro. |
| Contratos | Aplicar condiciones logísticas pactadas. |
| Crédito | Validar si el flete puede financiarse. |
| Reclamos | Crear incidencia y conversación. |
| Reviews | Calificar vendedor y transportista. |
| ERP/Odoo | Sincronizar CRM, ventas, inventario, entregas y facturación. |

---

# 13. Integración recomendada con Odoo

| Funcionalidad Marketplace Agro | Odoo |
|---|---|
| Leads y oportunidades | CRM |
| Contactos y empresas | Contacts |
| Actividades | Mail / Activities |
| Cotizaciones y órdenes | Sales |
| Compras a transportistas | Purchase |
| Inventario y entregas | Inventory |
| Flota propia | Fleet |
| Facturas y pagos | Accounting / Invoicing |
| Documentos | Documents / Attachments |
| Agenda | Calendar |
| Soporte | Helpdesk |
| Conversaciones | Discuss / Mail con capa propia del marketplace |
| Marketplace de transportistas | Desarrollo propio integrado con Purchase, Fleet e Inventory |

La mensajería y contratación multiactor deben mantenerse como capa propia del Marketplace Agro, aunque se sincronicen actividades, contactos y documentos con Odoo.

---

# 14. Arquitectura técnica sugerida

## 14.1 Servicios

1. `crm-service`
2. `conversation-service`
3. `notification-service`
4. `freight-marketplace-service`
5. `fleet-service`
6. `shipment-service`
7. `tracking-service`
8. `document-service`
9. `pricing-service`
10. `audit-service`
11. `odoo-integration-service`

## 14.2 Eventos de negocio

```text
LEAD_CREATED
OPPORTUNITY_CREATED
QUOTE_SENT
ORDER_CREATED
LOGISTICS_MODE_REQUIRED
FREIGHT_REQUEST_CREATED
FREIGHT_OFFER_RECEIVED
FREIGHT_OFFER_ACCEPTED
SHIPMENT_SCHEDULED
SHIPMENT_PICKED_UP
SHIPMENT_IN_TRANSIT
SHIPMENT_DELIVERED
LOGISTICS_INCIDENT_CREATED
POD_UPLOADED
OPPORTUNITY_WON
POSTSALE_ACTIVITY_CREATED
```

---

# 15. Plan de implementación por etapas

## Etapa 0 — Análisis y parametrización

**Duración sugerida:** 1 sprint.

### Actividades

- Validar roles y permisos.
- Definir estados y modalidades logísticas.
- Definir países iniciales.
- Definir reglas de facturación del flete.
- Definir integración con Odoo.
- Aprobar el alcance MVP.
- Elaborar prototipos.
- Aprobar el modelo de datos.

### Entregables

- Documento funcional aprobado.
- Matriz de roles y permisos.
- Mapa de procesos.
- Modelo de datos.
- Prototipos.
- Backlog priorizado.

## Etapa 1 — CRM base

**Duración sugerida:** 2 sprints.

### Alcance

- Empresas.
- Contactos.
- Leads.
- Oportunidades.
- Pipeline.
- Actividades.
- Agenda.
- Notas.
- Historial.
- Integración con productos, RFQ y órdenes.

### Resultado

El vendedor puede gestionar el ciclo comercial completo desde la captación hasta la venta.

## Etapa 2 — Mensajería multiactor

**Duración sugerida:** 2 sprints.

### Alcance

- Centro de conversaciones.
- Conversaciones por empresa, RFQ y orden.
- Archivos.
- Participantes.
- Notificaciones.
- Tareas.
- Notas internas.
- Registro de lectura.
- Auditoría.

### Resultado

Comprador, vendedor y actores autorizados pueden coordinar operaciones dentro de la plataforma.

## Etapa 3 — Selección logística en checkout

**Duración sugerida:** 1 sprint.

### Alcance

- Pregunta logística obligatoria.
- Transporte del comprador.
- Flota del vendedor.
- Solicitud a terceros.
- Datos de retiro.
- Cálculo preliminar del flete.
- Vinculación con la orden.

### Resultado

Toda orden define claramente quién gestiona el transporte.

## Etapa 4 — Flota propia del vendedor

**Duración sugerida:** 2 sprints.

### Alcance

- Flotas.
- Vehículos.
- Conductores.
- Capacidades.
- Disponibilidad.
- Cobertura.
- Tarifas.
- Programación.
- Documentos.

### Resultado

El vendedor puede ofrecer y gestionar su propia logística.

## Etapa 5 — Marketplace de operadores logísticos

**Duración sugerida:** 3 sprints.

### Alcance

- Registro y validación de operadores.
- Zonas y tipos de carga.
- Solicitudes de flete.
- Invitaciones.
- Ofertas.
- Comparación.
- Negociación.
- Selección.
- Reserva.
- Comisiones.

### Resultado

Comprador o vendedor puede contratar empresas logísticas dentro de la plataforma.

## Etapa 6 — Tracking, entrega e incidencias

**Duración sugerida:** 2 sprints.

### Alcance

- Eventos de tracking.
- Estados.
- Notificaciones.
- Prueba de entrega.
- Incidencias.
- Reprogramaciones.
- Devoluciones.
- Cierre.
- Reputación.

### Resultado

La operación se controla desde el retiro hasta la entrega final.

## Etapa 7 — Finanzas, liquidaciones e integración ERP

**Duración sugerida:** 2 sprints.

### Alcance

- Facturación del flete.
- Comisiones.
- Liquidaciones.
- Reembolsos.
- Conciliación.
- Cuentas por pagar.
- Sincronización CRM, ventas, entregas y contabilidad.

### Resultado

El flujo comercial y logístico queda integrado con la administración financiera.

## Etapa 8 — Analítica y optimización

**Duración sugerida:** 1 sprint.

### Alcance

- Conversión de leads.
- Valor del pipeline.
- Tiempo de respuesta.
- Tasa de cierre.
- Costos logísticos.
- Cumplimiento.
- Entregas a tiempo.
- Incidencias.
- Rentabilidad por cliente y ruta.
- Desempeño de transportistas.

---

# 16. Backlog por épicas

| Épica | Nombre |
|---|---|
| EP-CRM-01 | Empresas, contactos y cuentas |
| EP-CRM-02 | Leads y oportunidades |
| EP-CRM-03 | Pipeline y actividades |
| EP-COM-01 | Mensajería multiactor |
| EP-COM-02 | Notificaciones y tareas |
| EP-LOG-01 | Selección de modalidad logística |
| EP-LOG-02 | Flota propia del vendedor |
| EP-LOG-03 | Operadores logísticos |
| EP-LOG-04 | Solicitudes y ofertas de flete |
| EP-LOG-05 | Reserva y programación |
| EP-LOG-06 | Tracking y prueba de entrega |
| EP-LOG-07 | Incidencias y reclamos |
| EP-FIN-01 | Facturación y liquidación logística |
| EP-INT-01 | Integración con Odoo |
| EP-BI-01 | Analítica CRM y logística |

---

# 17. MVP recomendado

El MVP debe incluir:

1. Empresas y contactos.
2. Leads y oportunidades.
3. Pipeline y actividades.
4. Conversación comprador-vendedor.
5. Conversación por orden.
6. Pregunta logística en checkout.
7. Transporte del comprador.
8. Flota básica del vendedor.
9. Solicitud de flete.
10. Registro de operadores.
11. Ofertas logísticas.
12. Comparación de ofertas.
13. Reserva.
14. Tracking por estados.
15. Prueba de entrega.
16. Incidencias.
17. Facturación básica del flete.
18. Auditoría.

Puede dejarse para una fase posterior:

- Geolocalización en tiempo real.
- Optimización automática de rutas.
- Subasta dinámica de fletes.
- IA para recomendación de transportistas.
- Integración telemática de vehículos.
- Tarifación automática avanzada.
- Consolidación de cargas.
- Cross-docking.
- Seguros dinámicos.
- Traducción automática del chat.

---

# 18. Criterios de aceptación

| Código | Criterio |
|---|---|
| CA-CRM-01 | Un vendedor puede crear y gestionar un lead. |
| CA-CRM-02 | Un lead puede convertirse en oportunidad. |
| CA-CRM-03 | Una oportunidad puede vincular productos, RFQ, cotización y orden. |
| CA-COM-01 | Comprador y vendedor pueden comunicarse dentro de una operación. |
| CA-COM-02 | Los mensajes quedan vinculados a la entidad correspondiente. |
| CA-COM-03 | Las notas internas no son visibles para usuarios externos. |
| CA-LOG-01 | Toda orden física exige seleccionar modalidad logística. |
| CA-LOG-02 | El comprador puede registrar transporte propio. |
| CA-LOG-03 | El vendedor puede ofrecer su flota si tiene capacidad. |
| CA-LOG-04 | El vendedor puede crear una solicitud de flete para terceros. |
| CA-LOG-05 | Un operador autorizado puede responder con una oferta. |
| CA-LOG-06 | Las ofertas pueden compararse por precio, tiempo y reputación. |
| CA-LOG-07 | Una oferta aceptada crea una reserva. |
| CA-LOG-08 | El sistema permite programar retiro y entrega. |
| CA-LOG-09 | El tracking registra eventos y responsables. |
| CA-LOG-10 | La prueba de entrega cierra el despacho. |
| CA-FIN-01 | El costo de flete puede incluirse en la orden o facturarse aparte. |
| CA-AUD-01 | Toda acción crítica genera trazabilidad. |

---

# 19. KPI recomendados

## CRM

- Leads nuevos y contactados.
- Tasa de conversión.
- Valor del pipeline.
- Tiempo medio de respuesta.
- Oportunidades ganadas y perdidas.
- Ventas por representante.
- Clientes recurrentes.
- Valor de vida del cliente.

## Comunicación

- Tiempo medio de primera respuesta.
- Conversaciones abiertas y resueltas.
- Mensajes sin leer.
- SLA de atención.
- Tasa de respuesta por vendedor.

## Logística

- Solicitudes de flete.
- Ofertas por solicitud.
- Costo promedio por ruta.
- Tiempo de selección.
- Entregas a tiempo.
- Incidencias.
- Tasa de cumplimiento.
- Costo logístico por orden.
- Ocupación de flota.
- Rentabilidad por viaje.
- Calificación del transportista.

---

# 20. Resultado esperado

Con esta implementación, el Marketplace Agro podrá gestionar una operación integral:

```text
Cliente
→ Consulta o compra
→ CRM registra oportunidad
→ Vendedor conversa con el cliente
→ Se confirma necesidad logística
→ Cliente selecciona transporte propio, flota del vendedor o tercero
→ Se cotiza y contrata el transporte
→ Se prepara la mercancía
→ Se despacha
→ Se realiza seguimiento
→ Se entrega
→ Se factura y liquida
→ Se ejecuta posventa
```

El marketplace se convierte así en una plataforma de coordinación comercial agroindustrial que conecta productores, vendedores, compradores, representantes comerciales, almacenes, empresas logísticas, conductores, finanzas, soporte y administración.

La incorporación del CRM y de la logística colaborativa permite que una empresa no solo venda café u otros productos, sino que gestione la relación con el cliente y resuelva la entrega utilizando recursos propios o contratando servicios disponibles dentro del mismo ecosistema.
