# AutoMaster – Cobertura del ERS en el prototipo

El prototipo implementa la capa visual e interactiva de los diez módulos definidos en el ERS de AutoMaster y agrega persistencia local para demostrar los flujos completos sin instalar un servidor.

| ERS | Cobertura del prototipo |
|---|---|
| RF01 Clientes | Registro, edición, datos personales, cotizaciones, compras, interacciones y expediente |
| RF02 Vendedores | Carteras, oportunidades, metas, ventas y comisiones |
| RF03 Stock/VIN | Inventario, estado, ubicación, color, año, reserva y búsqueda |
| RF04 Repuestos | Catálogo, compatibilidad, stock mínimo, pedidos y ajuste de inventario |
| RF05 Financiamiento | Pie, cuotas, tasa, VFG, seguros, riesgo y estados de solicitud |
| RF06 Test Drive | Agenda, vigencia de licencia, vehículo demo y reprogramación |
| RF07 Documentos | Contratos/órdenes/cartas, archivos, expediente y firma pendiente |
| RF08 Garantías | Pólizas, fecha/kilometraje, reclamos y extensiones |
| RF09 Modelos | Versiones, ficha técnica, equipamiento, imágenes y precios |
| RF10 Postventa | OT, repuestos, mano de obra, estado y mantenciones |

## Requisitos transversales demostrados

- Diseño responsivo.
- Dashboard diferenciado por rol (RBAC demostrativo).
- Búsqueda y exportación CSV.
- Respaldo/restauración de datos en JSON.
- Notificaciones internas.
- Catálogo público y centro de gestión separados.

## Requisitos que requieren infraestructura real

Los siguientes puntos no pueden cumplirse de forma real abriendo solamente `index.html`: HTTPS/TLS 1.3, PostgreSQL/SQL Server, AES-256 de documentos en servidor, APIs REST con financieras, SMS/correo reales, firma digital legal, lectores/impresoras/escáneres físicos, respaldos automáticos de servidor, disponibilidad 99,5% y validación de rendimiento con 150 usuarios concurrentes.

## Actualización de reglas comerciales del simulador

Para el prototipo se parametrizaron como reglas fijas del producto:

- Pie mínimo: 10% del valor del vehículo.
- Tasa mensual referencial: 2,79% (no editable por el cliente).
- Valor Futuro Garantizado (VFG): 20% (no editable).
- Seguro de desgravamen: opcional, 2,0% del monto financiado.
- Seguro de cesantía: opcional, 2,0% del monto financiado.

El catálogo público muestra especificaciones técnicas ampliadas para cada vehículo o motocicleta e incorpora fichas PDF descargables dentro de la carpeta `fichas/`.
