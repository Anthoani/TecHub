require('dotenv').config();

const DEFAULT_PORTS = {
  postgres: 5432,
  mysql: 3306,
};

const dialect = process.env.DB_DIALECT || 'postgres';

const base = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || DEFAULT_PORTS[dialect] || 5432,
  dialect,
  logging: false,
};

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production: {
    ...base,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
