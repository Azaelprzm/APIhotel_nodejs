# API de Gestión Hotelera

API REST académica desarrollada con Node.js, Express, Sequelize y PostgreSQL para administrar hoteles, habitaciones, clientes, reservas y pagos. Es el backend utilizado por [flutterHotel](https://github.com/Azaelprzm/flutterHotel).

> **Aviso de seguridad:** este repositorio contiene credenciales versionadas en `.env` y `config/config.json`. Deben considerarse comprometidas y rotarse antes de utilizar el servicio con datos reales. Esta actualización documenta el proyecto; no elimina secretos del historial ni corrige el backend.

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

Necesitas Node.js con npm y una base de datos PostgreSQL existente. El proyecto no declara una versión mínima de Node.js ni una matriz de versiones verificadas.

```bash
git clone https://github.com/Azaelprzm/APIhotel_nodejs.git
cd APIhotel_nodejs
npm ci
```

**No utilices el `.env` incluido en GitHub.** Reemplaza su contenido localmente por el de `.env.example` y configura una base de datos de desarrollo propia. Nunca ejecutes las pruebas manuales contra producción.

| Variable | Uso |
| --- | --- |
| `DB_NAME` | Nombre de una base de datos PostgreSQL ya creada |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de ese usuario |
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL, normalmente 5432 |
| `JWT_SECRET` | Clave privada y aleatoria para firmar JWT |
| `PORT` | Puerto HTTP; por defecto 5003 |

```bash
npm start
```

El comando ejecuta `nodemon index.js`. Primero se sincronizan los modelos con `sequelize.sync({ force: false })`; el servidor solo empieza a escuchar si esa sincronización finaliza correctamente. No crea la base de datos PostgreSQL, ni ejecuta las migraciones de `migrations/`.

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

No hay scripts de pruebas, lint ni CI configurados. Una comprobación de sintaxis sin iniciar el servidor es:

```bash
node --check index.js
```

Los ejemplos de la referencia son ilustrativos; no representan pruebas de integración ejecutadas contra una base de datos.

## Estado del proyecto

La implementación es educativa y no está lista para procesar datos personales o pagos reales. Incluye dependencias versionadas en `node_modules/`, una configuración antigua para Sequelize CLI y limitaciones funcionales descritas en la documentación. Las mejoras de seguridad y funcionamiento deben hacerse en cambios separados de esta documentación.
