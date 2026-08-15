const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN = '1d' } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado. Defina a variável de ambiente JWT_SECRET.');
}

// Gera um token JWT assinado com o conteúdo e o prazo definidos na configuração.
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Valida a assinatura e a expiração de um token JWT e retorna seu conteúdo.
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
