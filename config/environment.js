require('dotenv').config();

function validateEnvironment(env = process.env) {
  const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'JWT_SECRET'];
  const missing = required.filter((name) => !env[name] || !env[name].trim());
  if (missing.length) throw new Error(`Variables de entorno requeridas: ${missing.join(', ')}`);
  for (const name of ['DB_PORT', 'PORT']) {
    if (env[name] !== undefined && (!/^[0-9]+$/.test(env[name]) || Number(env[name]) < 1 || Number(env[name]) > 65535)) {
      throw new Error(`${name} debe ser un puerto válido entre 1 y 65535`);
    }
  }
  if (env.JWT_SECRET.length < 32 || env.JWT_SECRET.includes('reemplazar_con')) {
    throw new Error('JWT_SECRET debe ser una clave privada aleatoria de al menos 32 caracteres');
  }
}
module.exports = { validateEnvironment };
