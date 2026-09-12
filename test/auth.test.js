const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
process.env.JWT_SECRET = 'clave-ficticia-de-prueba-no-usar-en-produccion';
function invoke(header) {
  const req = { headers: header === undefined ? {} : { authorization: header } };
  const result = { status: undefined, next: false, req };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; },
  };
  verifyToken(req, res, () => { result.next = true; });
  return result;
}
test('sin token responde 403', () => assert.equal(invoke().status, 403));
test('rechaza encabezados sin Bearer', () => assert.equal(invoke('Basic abc').status, 403));
test('rechaza JWT inválido', () => assert.equal(invoke('Bearer abc').status, 401));
test('JWT de login asigna userId y continúa', () => {
  const token = jwt.sign({ userId: 7 }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const result = invoke(`Bearer ${token}`);
  assert.equal(result.next, true);
  assert.equal(result.req.userId, 7);
});
test('rechaza tokens expirados', () => {
  const token = jwt.sign({ userId: 7 }, process.env.JWT_SECRET, { expiresIn: -1 });
  assert.equal(invoke(`Bearer ${token}`).status, 401);
});
test('rechaza tokens sin identificador', () => {
  const token = jwt.sign({}, process.env.JWT_SECRET);
  assert.equal(invoke(`Bearer ${token}`).status, 401);
});
test('rechaza firma distinta', () => {
  const token = jwt.sign({ userId: 7 }, 'otra-clave-ficticia');
  assert.equal(invoke(`Bearer ${token}`).status, 401);
});
