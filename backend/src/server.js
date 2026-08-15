const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

// Valida a conexão com o banco e inicia o servidor HTTP da API.
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Não foi possível conectar ao banco de dados:', err.message);
    process.exit(1);
  }
}

start();
