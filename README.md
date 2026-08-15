# Órbita – E-commerce full stack

O Órbita é uma aplicação didática de comércio eletrônico. O projeto possui uma interface em React, uma API em Node.js e um banco de dados relacional.

Este guia foi escrito para quem está começando. Siga as etapas na ordem apresentada.

## Funcionalidades

### Funcionalidades gerais

- Cadastro, login e atualização dos dados da conta.
- Autenticação com JWT e controle de acesso por perfil.
- Catálogo com paginação, busca por nome e filtro por categoria.
- Detalhes, preço e estoque dos produtos.
- Layout responsivo e estados de carregamento, erro e conteúdo vazio.

### Funcionalidades do comprador

- Adicionar, alterar a quantidade e remover produtos do carrinho.
- Favoritar e desfavoritar produtos.
- Consultar uma área com os produtos favoritos.
- Visualizar quantos corações um produto recebeu.
- Preencher o endereço automaticamente por meio do CEP.
- Finalizar uma compra e consultar os próprios pedidos.

### Funcionalidades do vendedor

- Consultar todos os pedidos e os dados do comprador.
- Autorizar, cancelar e atualizar o andamento dos pedidos.
- Gerenciar produtos e categorias pela API documentada no Swagger.

### Recursos técnicos

- Senhas criptografadas com bcrypt e validação com Zod.
- Rate limiting, Helmet e configuração de CORS.
- Checkout executado em transação no banco de dados.
- Compatibilidade com PostgreSQL e MySQL.
- Documentação interativa da API com Swagger.

## Tecnologias utilizadas

| Camada | Tecnologias |
|---|---|
| Frontend | React, React Router, Axios e Vite |
| Backend | Node.js, Express, Sequelize e Zod |
| Banco de dados | PostgreSQL ou MySQL |
| Segurança | JWT, bcrypt, Helmet e Express Rate Limit |

## Organização do projeto

```text
orbita_ecommerce/
├── backend/     API, regras de negócio, migrations e seeders
├── frontend/    interface da aplicação em React
└── README.md    instruções do projeto
```

O frontend e o backend são aplicações independentes. Cada pasta possui seu próprio `package.json` e suas próprias dependências.

## 1. Instale os programas necessários

Antes de abrir o projeto, instale:

1. [Node.js](https://nodejs.org/) versão 18 ou superior. A versão LTS é recomendada.
2. [PostgreSQL](https://www.postgresql.org/download/) ou [MySQL](https://dev.mysql.com/downloads/mysql/).
3. Um editor de código, como [Visual Studio Code](https://code.visualstudio.com/).

Para confirmar que Node.js e npm foram instalados, abra um terminal e execute:

```bash
node --version
npm --version
```

Os dois comandos devem mostrar um número de versão. Se aparecer “comando não encontrado” ou “não é reconhecido”, reinicie o terminal após instalar o Node.js.

> Para a primeira execução, recomendamos PostgreSQL. Durante a instalação, anote a senha definida para o usuário `postgres` e mantenha o serviço do banco em execução.

## 2. Abra o projeto no terminal

No Visual Studio Code, abra a pasta `orbita_ecommerce`. Em seguida, acesse **Terminal → Novo terminal**.

Confirme que o terminal está na pasta que contém `backend` e `frontend`:

```bash
dir
```

No macOS ou Linux, você também pode usar `ls`.

## 3. Configure e instale o backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Crie o arquivo de configuração local copiando o exemplo.

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

No macOS ou Linux:

```bash
cp .env.example .env
```

Abra `backend/.env` e confira os valores:

```env
NODE_ENV=development
PORT=3001

DB_DIALECT=postgres
DB_HOST=localhost
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=troque-por-uma-frase-secreta-grande
JWT_EXPIRES_IN=1d

FRONTEND_URL=http://localhost:5173
```

Altere `DB_PASSWORD` para a senha escolhida durante a instalação do PostgreSQL. Se o banco estiver em outra máquina ou porta, configure também `DB_HOST` e `DB_PORT`.

### Uso com MySQL

Para usar MySQL, ajuste:

```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecommerce
DB_USER=root
DB_PASSWORD=sua-senha
```

Os drivers de PostgreSQL e MySQL já fazem parte do projeto.

## 4. Prepare o banco de dados

Ainda dentro de `backend`, execute:

```bash
npm run db:setup
```

Esse comando cria o banco `ecommerce`, cria as tabelas pelas migrations e insere categorias e produtos de demonstração.

Se preferir executar uma etapa por vez:

```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

## 5. Inicie o backend

Execute:

```bash
npm run dev
```

Mantenha esse terminal aberto. A mensagem abaixo indica que a API está funcionando:

```text
Conexão com o banco de dados estabelecida com sucesso.
Servidor rodando em http://localhost:3001
```

Endereços úteis:

- Verificação da API: [http://localhost:3001/api/health](http://localhost:3001/api/health)
- Documentação Swagger: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## 6. Configure e instale o frontend

Não feche o terminal do backend. Abra um **segundo terminal** no Visual Studio Code.

Partindo da pasta principal:

```bash
cd frontend
npm install
```

Se o terminal estiver em `backend`, use `cd ../frontend`.

Copie o arquivo de configuração.

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

No macOS ou Linux:

```bash
cp .env.example .env
```

O arquivo `frontend/.env` deve conter:

```env
VITE_API_URL=http://localhost:3001/api
```

## 7. Inicie o frontend

No terminal do frontend, execute:

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 8. Crie usuários para testar

Os dados de demonstração incluem produtos e categorias, mas não usuários. Use **Cadastrar** na aplicação.

Crie duas contas com e-mails diferentes:

1. Uma conta **Comprador** para testar favoritos, carrinho e checkout.
2. Uma conta **Vendedor** para consultar e atualizar pedidos.

## Como executar nas próximas vezes

Depois da primeira instalação, não repita `npm install`, `db:setup` nem a cópia dos arquivos `.env`. Inicie o banco e abra dois terminais.

Terminal 1 – backend:

```bash
cd backend
npm run dev
```

Terminal 2 – frontend:

```bash
cd frontend
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173). Para encerrar um servidor, clique no terminal correspondente e pressione `Ctrl + C`.

## Comandos disponíveis

### Backend

| Comando | Função |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia a API com reinicialização automática |
| `npm start` | Inicia a API sem reinicialização automática |
| `npm run db:create` | Cria o banco de dados |
| `npm run db:migrate` | Executa migrations pendentes |
| `npm run db:seed` | Insere dados de demonstração |
| `npm run db:setup` | Executa criação, migrations e seed |

### Frontend

| Comando | Função |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Visualiza a versão de produção |

## Principais rotas da API

| Método | Rota | Acesso | Função |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Cadastra um usuário |
| `POST` | `/api/auth/login` | Público | Autentica um usuário |
| `GET`, `PATCH` | `/api/auth/me` | Autenticado | Consulta ou atualiza a conta |
| `GET` | `/api/products` | Público | Lista e pesquisa produtos |
| `GET` | `/api/products/:id` | Público | Retorna um produto |
| `POST` | `/api/products` | Vendedor | Cria um produto |
| `PUT`, `DELETE` | `/api/products/:id` | Vendedor | Atualiza ou remove um produto |
| `GET`, `POST` | `/api/categories` | Conforme a operação | Consulta ou cria categorias |
| `GET`, `DELETE` | `/api/cart` | Comprador | Consulta ou esvazia o carrinho |
| `POST` | `/api/cart/items` | Comprador | Adiciona um item ao carrinho |
| `PUT`, `DELETE` | `/api/cart/items/:itemId` | Comprador | Atualiza ou remove um item |
| `GET` | `/api/favorites` | Comprador | Lista os favoritos |
| `POST`, `DELETE` | `/api/favorites/:productId` | Comprador | Adiciona ou remove um favorito |
| `POST` | `/api/orders` | Comprador | Finaliza uma compra |
| `GET` | `/api/orders` | Autenticado | Lista os pedidos permitidos |
| `GET` | `/api/orders/:id` | Autenticado | Exibe um pedido |
| `PATCH` | `/api/orders/:id/status` | Vendedor | Atualiza o status do pedido |

Os formatos completos e a opção de testar as rotas estão disponíveis no Swagger.

## Solução de problemas

### O comando `npm` não funciona

Instale Node.js LTS, feche o terminal e abra-o novamente. Confirme com `node --version` e `npm --version`.

### Erro de conexão com o banco

Verifique se:

- PostgreSQL ou MySQL está em execução.
- Usuário e senha em `backend/.env` estão corretos.
- `DB_DIALECT` corresponde ao banco instalado.
- A porta está correta: normalmente `5432` para PostgreSQL e `3306` para MySQL.

Depois da correção, interrompa o backend com `Ctrl + C` e execute `npm run dev` novamente.

### Erro `database does not exist`

Dentro de `backend`, execute:

```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

### O catálogo não carrega os produtos

Confirme se o backend continua aberto e acesse [http://localhost:3001/api/health](http://localhost:3001/api/health). Confira também se `frontend/.env` aponta para `http://localhost:3001/api`.

### A porta já está sendo usada

Encerre o processo antigo com `Ctrl + C`. Para utilizar outra porta, altere `PORT` em `backend/.env` e atualize `VITE_API_URL` em `frontend/.env` com a mesma porta.

### Os produtos não aparecem

Execute `npm run db:migrate` e `npm run db:seed` dentro de `backend`.

### Alterei `.env`, mas nada mudou

Interrompa o servidor com `Ctrl + C` e execute `npm run dev` novamente. O `.env` é lido quando o servidor inicia.

## Observação de segurança

Este é um projeto educacional. O JWT é armazenado em `localStorage` para simplificar o aprendizado. Em produção, considere cookies `httpOnly` e `SameSite`, HTTPS, monitoramento e gerenciamento seguro de segredos.
