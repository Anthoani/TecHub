const { Op } = require('sequelize');
const sequelize = require('../config/database');

// O PostgreSQL possui um operador LIKE próprio que ignora maiúsculas e minúsculas.
// MySQL e MariaDB não aceitam Op.iLike e utilizam a configuração padrão de texto,
// na qual um LIKE comum já apresenta o mesmo comportamento.
// Escolhe o operador de busca textual compatível com o banco configurado.
function likeOperator() {
  return sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;
}

module.exports = { likeOperator };
