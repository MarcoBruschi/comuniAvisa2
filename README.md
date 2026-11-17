# ComuniAvisa 📢

Plataforma comunitária para publicação, visualização e gerenciamento de alertas e avisos locais.

---

## 🛠️ Tecnologias

- **Backend:**
  - Node.js (ES Modules)
  - Express
  - MongoDB + Mongoose
  - Autenticação via JWT (Access & Refresh Tokens) e Cookies seguros
  - CORS, bcrypt, dotenv

- **Frontend:**
  - React 19
  - Vite
  - React Router DOM
  - Axios

---

## 📁 Estrutura do Repositório

```text
comuniAvisa2/
├── backend/            # API REST em Node.js / Express
│   ├── config/         # Conexão com o banco (MongoDB)
│   ├── controllers/    # Controladores de regras de negócio
│   ├── functions/      # Funções utilitárias e middlewares
│   ├── models/         # Modelos Mongoose (Alerta, Usuario, etc.)
│   ├── routes/         # Rotas da API
│   ├── .env.example    # Exemplo de variáveis de ambiente do backend
│   ├── app.js
│   └── server.js
│
├── frontend/           # Aplicação Web em React / Vite
│   ├── src/            # Componentes, páginas e serviços
│   ├── .env.example    # Exemplo de variáveis de ambiente do frontend
│   ├── index.html
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [MongoDB](https://www.mongodb.com/) rodando localmente ou conexão com o MongoDB Atlas

---

### 1. Configurando o Backend

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` a partir do modelo de exemplo:
   ```bash
   cp .env.example .env
   # No Windows PowerShell:
   # Copy-Item .env.example .env
   ```

4. Preencha as variáveis no `.env`:
   - `PORT`: Porta da API (ex: `5000`)
   - `NODE_ENV`: `development` ou `production`
   - `MONGO_URI`: String de conexão do MongoDB
   - `FRONTEND_URL`: URL onde o frontend estará rodando (ex: `http://localhost:5173`)
   - `COOKIE_KEY`: Chave secreta para assinar cookies
   - `ACCESS_SECRET_KEY`: Chave secreta para token de acesso JWT
   - `REFRESH_SECRET_KEY`: Chave secreta para refresh token JWT

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   O backend estará acessível em `http://localhost:5000` (ou na porta configurada).

---

### 2. Configurando o Frontend

1. Em outro terminal, acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` a partir do modelo de exemplo:
   ```bash
   cp .env.example .env
   # No Windows PowerShell:
   # Copy-Item .env.example .env
   ```

4. Preencha a variável no `.env`:
   ```env
   VITE_URL_BASE=http://localhost:5000
   ```
   *(Aponte para a mesma porta em que o backend está rodando)*

5. Inicie o frontend:
   ```bash
   npm run dev
   ```
   Acesse a URL indicada no terminal (geralmente `http://localhost:5173`).

---

## 📜 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE.md](LICENSE.md) para mais informações.
