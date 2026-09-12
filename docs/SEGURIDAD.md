# Seguridad y tareas pendientes

Este proyecto es académico. No debe utilizarse con credenciales, tarjetas o datos personales reales hasta atender estos puntos.

## Credenciales publicadas

Se retiró `.env` del seguimiento y se sustituyó `config/config.json` por `config/config.js` basado en variables de entorno. Los secretos siguen en el historial y deben considerarse comprometidos, aunque el servicio original ya no esté activo. No se reproducen en esta documentación.

Orden recomendado de reparación:

1. Rotar la contraseña PostgreSQL y cualquier clave JWT publicada, en el proveedor del servicio.
2. Actualizar las variables privadas del despliegue y comprobar el funcionamiento. Rotar JWT invalida las sesiones existentes.
3. La configuración sin secretos y las exclusiones ya están implementadas en este PR. Instalar dependencias con `npm ci` en el nuevo despliegue; no reutilizar un `.env` antiguo.
4. Evaluar y acordar una limpieza del historial Git y de referencias remotas. Eliminar los archivos del último commit no borra versiones históricas ni copias previas.

La rotación en el proveedor y la limpieza del historial no se realizaron. Antes de fusionar y desplegar, configura DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT y un JWT_SECRET aleatorio de al menos 32 caracteres. El nuevo arranque rechaza una configuración incompleta o la clave de ejemplo. Si la plataforma despliega automáticamente main, prepara primero sus variables privadas y su versión Node.js (22 o 24). El PR se mantiene en borrador para evitar un despliegue accidental.

## Datos de tarjetas

El campo `tarjeta` se almacena como texto y aparece en respuestas de pagos. No envíes números reales, CVV ni otros datos financieros. La API no integra una pasarela de pagos; registra información de ejemplo. Una evolución segura debe usar un proveedor de pagos y referencias/tokenización, no almacenar números de tarjeta.

## Mejoras de backend pendientes

- La discrepancia `userId`/`id` del JWT ya fue corregida y tiene pruebas.
- Validar y normalizar entradas, restringir CORS y limitar intentos de acceso.
- Evitar devolver objetos internos de error en respuestas 500.
- Aplicar roles y permisos: actualmente cualquier usuario autenticado accede a los recursos protegidos y puede listar usuarios.
- Hacer transaccionales las operaciones de reservas/pagos y evitar carreras de actualización.
- Verificar disponibilidad de habitación, coherencia hotel/habitación y pagos históricos.
- Usar importes decimales exactos y configurar transporte seguro a PostgreSQL según el proveedor.
- Node.js 22/24, comprobación de sintaxis y pruebas unitarias están configurados; faltan pruebas de integración CRUD y PostgreSQL.

Se ejecutó npm audit y se aplicaron actualizaciones compatibles mediante npm audit fix, sin --force. El informe pasó de 16 avisos (10 altos) a 4 moderados: qs/Express y uuid/Sequelize. La propuesta de npm para uuid incluye retroceder Sequelize a una versión mayor antigua; no se aplicó por ser incompatible. Estos avisos deben revisarse antes de producción. No se hicieron pruebas contra el servidor público ni se certifica la seguridad de la API.
