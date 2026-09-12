# Arquitectura y modelo de datos

## Flujo de una petición

`index.js` configura Express, CORS abierto, logging mediante Morgan y lectura de JSON. Monta los routers bajo `/api`. Las rutas protegidas pasan por `middlewares/authMiddleware.js`, que verifica el JWT, y después ejecutan operaciones Sequelize sobre PostgreSQL.

```text
Cliente Flutter / cliente HTTP
  → Express y router
  → Middleware JWT (excepto registro, login y raíz)
  → Controlador o manejador de ruta
  → Modelo Sequelize
  → PostgreSQL
```

## Organización

| Directorio | Responsabilidad |
| --- | --- |
| `config/database.js` | Conexión usada por los modelos; lee variables del entorno |
| `routes/` | Endpoints; varios contienen también lógica de negocio |
| `controllers/` | Autenticación, consulta de usuarios y pagos |
| `middlewares/` | Verificación JWT |
| `models/` | Modelos y asociaciones Sequelize |
| `migrations/` | Migraciones históricas, no ejecutadas por `npm start` |

`models/index.js` es una plantilla de Sequelize CLI que espera modelos exportados como funciones. Los modelos actuales exportan instancias directamente; por eso no debe presentarse ese archivo como punto de entrada funcional. La aplicación importa cada modelo por separado.

## Entidades

Todas las entidades incluyen `id`, `createdAt` y `updatedAt` generados por Sequelize.

| Entidad | Campos principales | Relaciones |
| --- | --- | --- |
| Usuario | nombre, email único, password hash | Sin relación con la propiedad de los datos hoteleros |
| Hotel | nombre, direccion, telefono, estrellas (1–5) | Tiene habitaciones y reservas |
| Habitacion | numero, tipo, costoPorNoche, hotelId | Pertenece a hotel; tiene reservas |
| Cliente | nombre, email único, telefono | Tiene reservas |
| Reserva | fechas, noches, total, metodoPago, adeudo, clienteId, hotelId, habitacionId | Pertenece a cliente, hotel y habitación; tiene pagos |
| Pago | monto, metodo, tarjeta opcional, reservaId | Pertenece a reserva |

Los importes se almacenan como `FLOAT`, no como decimales exactos. La declaración de unicidad de habitación y las migraciones no coinciden completamente; no se debe prometer unicidad por hotel sin corregir el esquema y verificarlo.

## Reservas y pagos: comportamiento actual

- `noches = ceil((fechaFin - fechaInicio) / 86400000)`.
- `total = noches × costoPorNoche` de la habitación consultada.
- `adeudo = total - pagoInicial` (por defecto, pagoInicial es 0).
- Crear una reserva con pago inicial positivo también crea un Pago.
- Actualizar una reserva recalcula su adeudo usando el pago inicial enviado, pero no crea un pago ni suma los pagos históricos.
- Registrar un pago posterior descuenta su monto del adeudo almacenado.
- La creación de reserva/pago y la actualización de adeudo no utilizan transacciones; una falla intermedia puede dejar datos inconsistentes.

## Limitaciones verificadas por lectura del código

- No hay validación completa de fechas inválidas, tipos, campos vacíos o montos negativos en reservas.
- No se comprueba que la habitación pertenezca al hotel enviado ni que no tenga reservas superpuestas.
- No hay paginación, roles ni aislamiento de datos por usuario.
- La autenticación firma `userId`, pero el middleware lee `decoded.id`: el campo `req.userId` queda indefinido. El token sí se verifica, pero `/api/test` no devuelve el identificador esperado.
- Las migraciones y la sincronización automática son mecanismos distintos; no se ofrece una secuencia CLI de migración como si estuviera preparada y probada.
- No se ha validado el despliegue, la conectividad PostgreSQL, TLS ni el comportamiento en producción.
