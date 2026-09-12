const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateEnvironment } = require('../config/environment');
const valid = {
  DB_NAME: 'local', DB_USER: 'local', DB_PASSWORD: 'ficticio',
  DB_HOST: 'localhost', DB_PORT: '5432', JWT_SECRET: 'clave-ficticia-de-prueba-no-usar-en-produccion',
};
test('acepta configuración completa', () => assert.doesNotThrow(() => validateEnvironment(valid)));
test('rechaza variables faltantes sin mostrar valores', () => {
  assert.throws(() => validateEnvironment({}), /Variables de entorno requeridas/);
});
test('rechaza claves cortas y plantillas', () => {
  assert.throws(() => validateEnvironment({ ...valid, JWT_SECRET: 'corta' }), /JWT_SECRET/);
  assert.throws(() => validateEnvironment({ ...valid, JWT_SECRET: 'reemplazar_con_clave_aleatoria_privada' }), /JWT_SECRET/);
});
test('rechaza puertos inválidos', () => {
  assert.throws(() => validateEnvironment({ ...valid, DB_PORT: 'abc' }), /DB_PORT/);
  assert.throws(() => validateEnvironment({ ...valid, PORT: '70000' }), /PORT/);
});
test('acepta índice de modelos sin conectarse a PostgreSQL', async () => {
  Object.assign(process.env, valid);
  const models = require('../models');
  assert.equal(models.Usuario.name, 'Usuario');
  assert.equal(models.Reserva.name, 'Reserva');
  await models.sequelize.close();
});
