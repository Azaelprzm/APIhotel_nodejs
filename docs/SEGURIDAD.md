# Seguridad y tareas pendientes

Este proyecto es académico. No debe utilizarse con credenciales, tarjetas o datos personales reales hasta atender estos puntos.

## Credenciales publicadas

Hay secretos en `.env` y credenciales PostgreSQL en `config/config.json`. No se reproducen en esta documentación. Deben considerarse comprometidos, aunque el servicio original ya no esté activo.

Orden recomendado de reparación:

1. Rotar la contraseña PostgreSQL y cualquier clave JWT publicada, en el proveedor del servicio.
2. Actualizar las variables privadas del despliegue y comprobar el funcionamiento. Rotar JWT invalida las sesiones existentes.
3. Sustituir las configuraciones con secretos por variables de entorno; retirar `.env` y `node_modules/` del seguimiento y agregar reglas de exclusión.
4. Evaluar y acordar una limpieza del historial Git y de referencias remotas. Eliminar los archivos del último commit no borra versiones históricas ni copias previas.

Esta actualización no realiza esas operaciones: requieren coordinación con el despliegue y autorización para cambios de configuración o historial.

## Datos de tarjetas

El campo `tarjeta` se almacena como texto y aparece en respuestas de pagos. No envíes números reales, CVV ni otros datos financieros. La API no integra una pasarela de pagos; registra información de ejemplo. Una evolución segura debe usar un proveedor de pagos y referencias/tokenización, no almacenar números de tarjeta.

## Mejoras de backend pendientes

- Corregir la discrepancia `userId`/`id` del JWT.
- Validar y normalizar entradas, restringir CORS y limitar intentos de acceso.
- Evitar devolver objetos internos de error en respuestas 500.
- Aplicar roles y permisos: actualmente cualquier usuario autenticado accede a los recursos protegidos y puede listar usuarios.
- Hacer transaccionales las operaciones de reservas/pagos y evitar carreras de actualización.
- Verificar disponibilidad de habitación, coherencia hotel/habitación y pagos históricos.
- Usar importes decimales exactos y configurar transporte seguro a PostgreSQL según el proveedor.
- Establecer una versión soportada de Node.js, revisar dependencias y agregar pruebas automatizadas.

No se ejecutó una auditoría de vulnerabilidades de dependencias ni pruebas contra el servidor público. Estas notas describen lo observado en el código, no una certificación de seguridad.
