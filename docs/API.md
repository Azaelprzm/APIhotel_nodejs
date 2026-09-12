# Referencia HTTP

Base local: `http://localhost:5003/api`. Todas las rutas de esta página son relativas a esa base, excepto `GET /` (raíz del servidor). Envía cuerpos JSON con `Content-Type: application/json`.

Los ejemplos usan datos ficticios. Los IDs, timestamps y el token se generan en ejecución. No pruebes operaciones de escritura contra el despliegue público.

## Autenticación y errores comunes

Todas las operaciones salvo registro, login y raíz requieren:

```http
Authorization: Bearer <token>
```

| Código | Significado actual |
| --- | --- |
| 200 | Consulta, modificación, login o eliminación correcta |
| 201 | Registro o creación correcta |
| 400 | Algunas validaciones de registro, fechas y pagos |
| 401 | Contraseña incorrecta o JWT inválido/expirado |
| 403 | Authorization ausente o token ausente en el encabezado |
| 404 | Recurso no encontrado; login sin usuario; pagos inexistentes |
| 500 | Error interno; incluye también varias entradas inválidas no manejadas como 400 |

Los errores usan un objeto con `message`; varios manejadores también devuelven `error`. No hay un esquema de error uniforme ni sanitizado. No se garantiza respuesta JSON para rutas inexistentes o JSON malformado.

## Registro e inicio de sesión

### `POST /auth/register` — público

```json
{"nombre":"Usuario de prueba","email":"usuario@example.com","password":"password-ficticio-local"}
```

Respuesta 201 ilustrativa:

```json
{"message":"Usuario registrado con éxito","userId":1}
```

Email ya registrado: 400. Otros fallos: 500. La contraseña se guarda como hash bcrypt, no se devuelve.

### `POST /auth/login` — público

```json
{"email":"usuario@example.com","password":"password-ficticio-local"}
```

Respuesta 200:

```json
{"message":"Inicio de sesión exitoso","token":"<JWT-generado>"}
```

Usuario inexistente: 404; contraseña incorrecta: 401; otros fallos: 500. El JWT firmado contiene `userId` y expira en una hora. No hay endpoint de refresh ni revocación de sesión.

Ejemplo local (shell Bash; en PowerShell adapta las comillas o usa un archivo JSON):

```bash
curl -X POST http://localhost:5003/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"usuario@example.com","password":"password-ficticio-local"}'
```

### `GET /auth/usuarios` — protegido

Devuelve 200 con un arreglo de objetos `{id, nombre, email}`. No devuelve password ni timestamps. No requiere rol administrativo.

### `GET /test` — protegido

Devuelve `{"message":"Acceso autorizado","userId":1}` para un JWT válido emitido por login. El identificador depende del usuario. El middleware comprueba el formato Bearer, firma HS256, expiración e identificador entero positivo.

## CRUD de hoteles, habitaciones y clientes

Las tres colecciones implementan la misma matriz de operaciones:

| Método | Ruta | Respuesta de éxito |
| --- | --- | --- |
| GET | `/hoteles`, `/habitaciones`, `/clientes` | 200, arreglo de entidades; vacío como `[]` |
| GET | `/hoteles/:id`, `/habitaciones/:id`, `/clientes/:id` | 200, entidad; 404 si no existe |
| POST | `/hoteles`, `/habitaciones`, `/clientes` | 201, entidad creada |
| PUT | `/hoteles/:id`, `/habitaciones/:id`, `/clientes/:id` | 200, entidad actualizada; 404 si no existe |
| DELETE | `/hoteles/:id`, `/habitaciones/:id`, `/clientes/:id` | 200, objeto message; 404 si no existe |

Todos requieren JWT. Los fallos de Sequelize se devuelven como 500. PUT reutiliza los campos de creación; no se documenta como PATCH ni se garantiza una actualización parcial.

### Hotel: cuerpo POST/PUT

```json
{"nombre":"Hotel de prueba","direccion":"Calle ejemplo 10","telefono":"5550000000","estrellas":3}
```

Los cuatro campos son no nulos en el modelo; estrellas es entero con rango 1–5. La entidad incluye además `id`, `createdAt`, `updatedAt`. DELETE devuelve `{"message":"Hotel eliminado"}`.

### Habitación: cuerpo POST/PUT

```json
{"numero":"101","tipo":"doble","costoPorNoche":900,"hotelId":1}
```

Los cuatro campos son no nulos. `hotelId` referencia a Hotel; `costoPorNoche` es FLOAT. La entidad agrega `id`, `createdAt`, `updatedAt`. DELETE devuelve `{"message":"Habitación eliminada"}`. No hay consulta de disponibilidad ni filtrado por hotel implementados en estas rutas.

### Cliente: cuerpo POST/PUT

```json
{"nombre":"Cliente de prueba","email":"cliente@example.com","telefono":"5551111111"}
```

Los tres campos son no nulos; email tiene restricción de unicidad. La entidad agrega `id`, `createdAt`, `updatedAt`. DELETE devuelve `{"message":"Cliente eliminado"}`.

Ejemplo de consulta autenticada:

```bash
curl http://localhost:5003/api/hoteles -H 'Authorization: Bearer <token>'
```

## Reservas

### `POST /reservas` y `PUT /reservas/:id`

Cuerpo ilustrativo:

```json
{
  "fechaInicio":"2027-01-10T15:00:00.000Z",
  "fechaFin":"2027-01-12T15:00:00.000Z",
  "clienteId":1,
  "hotelId":1,
  "habitacionId":1,
  "metodoPago":"efectivo",
  "pagoInicial":200
}
```

`pagoInicial` es opcional (0 por defecto). Las fechas y los campos de referencia/método se necesitan para una reserva coherente. Si se crea con pago inicial positivo y método tarjeta, el manejador también lee `tarjeta` del cuerpo. Usa solo datos ficticios: la API almacena ese campo sin tokenización.

El servidor calcula noches, total y adeudo. Con tarifa 900 y dos noches, respuesta de creación 201 ilustrativa (timestamps omitidos):

```json
{
  "id":1,
  "fechaInicio":"2027-01-10T15:00:00.000Z",
  "fechaFin":"2027-01-12T15:00:00.000Z",
  "clienteId":1,
  "hotelId":1,
  "habitacionId":1,
  "metodoPago":"efectivo",
  "noches":2,
  "total":1800,
  "adeudo":1600
}
```

Fechas invertidas o iguales: 400. Habitación inexistente: 404. PUT con reserva inexistente: 404. Otros fallos: 500. No existe validación completa de fechas inválidas, hotel/habitación, solapamientos o sobrepagos iniciales.

**Importante:** POST registra un Pago si pagoInicial es positivo. PUT solo recalcula `adeudo = total - pagoInicial`; no registra un Pago ni concilia los anteriores. Lee [las limitaciones](ARQUITECTURA.md) antes de editar reservas con pagos.

### `GET /reservas` y `GET /reservas/:id`

Devuelven 200 con arreglo o entidad respectivamente; reserva inexistente: 404. Incluyen campos de reserva y asociaciones `Cliente` (nombre, email), `Hotel` (nombre, direccion) y `Habitacion` (numero, tipo, costoPorNoche), según la serialización Sequelize. No incluyen el historial de pagos.

### `DELETE /reservas/:id`

Respuesta 200: `{"message":"Reserva eliminada."}`. Reserva inexistente: 404; fallo de eliminación: 500. El efecto sobre dependencias está sujeto al esquema PostgreSQL efectivo; no se promete cascada sin verificarlo.

## Pagos

### `POST /pagos`

```json
{"reservaId":1,"monto":300,"metodo":"efectivo"}
```

`metodo` admite `efectivo` o `tarjeta` en el modelo. Si es tarjeta, el controlador requiere `tarjeta`. No uses números reales.

Respuesta 201 ilustrativa, con timestamps omitidos:

```json
{"message":"Pago registrado con éxito.","pago":{"id":2,"reservaId":1,"monto":300,"metodo":"efectivo","tarjeta":null}}
```

Reserva inexistente: 404. Monto ≤ 0, monto mayor que adeudo, o tarjeta ausente para método tarjeta: 400. Otros fallos: 500. Descuenta el monto del adeudo y guarda la reserva, sin transacción conjunta.

### `GET /pagos/:reservaId`

Devuelve 200 con arreglo de pagos de esa reserva, incluidos `id`, `monto`, `metodo`, `tarjeta`, `reservaId`, `createdAt`, `updatedAt`. Si no hay pagos devuelve 404, **no `[]`**, independientemente de que la reserva exista. Otros fallos: 500.

No hay PUT, DELETE ni consulta por ID individual de pago.

## Raíz del servidor

`GET http://localhost:5003/` es público y devuelve texto, no JSON. Es la comprobación básica de que Express está escuchando; no constituye una prueba completa de disponibilidad de base de datos ni de todos los endpoints.
