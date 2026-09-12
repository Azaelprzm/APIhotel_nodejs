# API de Gestión Hotelera

API REST académica desarrollada con Node.js, Express, Sequelize y PostgreSQL para administrar hoteles, habitaciones, clientes, reservas y pagos. Es el backend utilizado por [flutterHotel](https://github.com/Azaelprzm/flutterHotel).

> **Aviso de seguridad:** las credenciales publicadas anteriormente en `.env` y `config/config.json` siguen accesibles en el historial Git. Este cambio las retira de la versión actual, pero deben rotarse en el proveedor antes de desplegar o utilizar datos reales. No se reescribió el historial.

## Documentación

- [Referencia de endpoints y ejemplos](docs/API.md)
- [Arquitectura, base de datos y limitaciones](docs/ARQUITECTURA.md)
- [Seguridad y tareas pendientes](docs/SEGURIDAD.md)

## Funcionalidades

- Registro e inicio de sesión con contraseñas protegidas mediante bcrypt y JWT de una hora.
- CRUD de hoteles, habitaciones, clientes y reservas.
- Cálculo de noches, total y adeudo de las reservas.
- Registro y consulta de pagos asociados a una reserva.
- Consulta de usuarios autenticados, sin devolver sus contraseñas.

## Ejecutar localmente

Necesitas Node.js 22 o superior con npm y una base de datos PostgreSQL existente. `.nvmrc` selecciona Node.js 24; la integración continua comprueba Node.js 22 y 24.

```bash
git clone https://github.com/Azaelprzm/APIhotel_nodejs.git
cd APIhotel_nodejs
npm ci
```

Crea un `.env` local a partir de `.env.example` y configura una base de datos de desarrollo propia. Si conservas una copia anterior, reemplaza las credenciales expuestas por otras nuevas. `.env` y `node_modules/` ahora se excluyen de Git. Nunca ejecutes las pruebas manuales contra producción.

| Variable | Uso |
| --- | --- |
| `DB_NAME` | Nombre de una base de datos PostgreSQL ya creada |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de ese usuario |
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL, normalmente 5432 |
| `JWT_SECRET` | Clave privada aleatoria de al menos 32 caracteres; no se acepta el marcador de la plantilla |
| `PORT` | Puerto HTTP; por defecto 5003 |

```bash
npm start
```

El comando ejecuta `node index.js`; usa `npm run dev` para desarrollo con nodemon. El arranque valida las variables obligatorias, puertos y clave JWT antes de conectarse. Primero se sincronizan los modelos con `sequelize.sync({ force: false })`; el servidor solo empieza a escuchar si esa sincronización finaliza correctamente. No crea la base de datos PostgreSQL, ni ejecuta las migraciones de `migrations/`.

Comprobación local:

```bash
curl http://localhost:5003/
```

Respuesta de texto: `API de Gestión Hotelera funcionando correctamente`.

## Uso básico

La base local de los endpoints es `http://localhost:5003/api`. El cliente Flutter utiliza la dirección configurada `https://apihotel-nodejs.onrender.com/api`; su disponibilidad no fue verificada durante esta documentación.

1. Registra un usuario de prueba en `POST /auth/register`.
2. Inicia sesión en `POST /auth/login`.
3. Envía el JWT recibido en `Authorization: Bearer <token>`.
4. Crea un hotel, un cliente y una habitación antes de crear una reserva.
5. Registra pagos con `POST /pagos` y consúltalos con `GET /pagos/:reservaId`.

Consulta [la referencia](docs/API.md) para conocer los campos, respuestas y errores reales.

## Comprobaciones disponibles

Las siguientes comprobaciones no inician el servidor ni ejecutan peticiones a producción:

```bash
npm run check
npm test
npm audit
```

GitHub Actions verifica sintaxis y pruebas en Node.js 22 y 24. Las 12 pruebas cubren el middleware JWT, validación de entorno e importación de modelos sin conexión PostgreSQL. No son pruebas de integración de CRUD. Los ejemplos de la referencia son ilustrativos.

## Estado del proyecto

La implementación es educativa y no está lista para procesar datos personales o pagos reales. Se retiraron los secretos y dependencias del seguimiento actual, se corrigió el identificador JWT y se actualizaron dependencias compatibles. Persisten limitaciones funcionales, secretos históricos y avisos de auditoría descritos en la documentación.
