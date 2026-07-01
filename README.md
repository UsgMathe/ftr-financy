# Financy 💰

![Badge](https://img.shields.io/badge/Tech_Developer_360-Rocketseat-8257E5?style=flat-square&logo=rocketseat)
![Badge](https://img.shields.io/badge/Status-Concluído-success?style=flat-square)

Financy é um aplicativo fullstack de gerenciamento de finanças desenvolvido como desafio prático para a pós-graduação **"Tech developer 360"** da **Faculdade de Tecnologia Rocketseat**.

Desenvolvido por **Matheus Gabriel Valenga**.

---

## 💻 Sobre o projeto

O Financy permite aos usuários o controle de suas finanças pessoais. Com ele, é possível registrar transações de entrada (receitas) e saída (despesas), além de organizar essas transações através de categorias personalizadas (com cores e ícones). O sistema conta com autenticação e um modelo robusto de dados utilizando GraphQL.

## 🚀 Tecnologias e Ferramentas

O projeto foi estruturado em um monorepo dividido entre o Front-end e o Back-end, utilizando as ferramentas mais modernas do ecossistema JavaScript/TypeScript.

### ⚙️ Back-end

- **Node.js** com **Express**
- **Apollo Server** & **GraphQL** (API estruturada e eficiente)
- **TypeGraphQL**
- **Prisma ORM** (com banco de dados **SQLite** para facilitar a execução local)
- **TypeScript**
- **Autenticação JWT**
- **Zod** (Validações)

### 🎨 Front-end

- **React 19** com **Vite**
- **Apollo Client** (Consumo da API GraphQL)
- **Tailwind CSS v4** (Estilização utilitária)
- **shadcn/ui** & **Radix UI** (Componentes acessíveis e de alta qualidade)
- **Zustand** (Gerenciamento de estado global)
- **React Hook Form** + **Zod** (Formulários e validações)
- **TypeScript**

---

## 🛠️ Como executar o projeto

Para rodar a aplicação na sua máquina, você vai precisar ter o **Node.js** e o **Git** instalados.

### 1. Clonar o repositório

```bash
git clone https://github.com/UsgMathe/ftr-financy
cd financy
```

### 2. Rodando o Back-end

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Crie e configure o arquivo .env
# (Você pode copiar o arquivo sample.env para .env)
cp sample.env .env

# Execute as migrações do banco de dados e gere o client do Prisma
npm run prisma:generate
npm run prisma:migrate

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

### 3. Rodando o Front-end

Abra uma nova aba no terminal e execute:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação web
npm run dev
```

---

## 📝 Licença

Esse projeto foi desenvolvido com fins educacionais como parte do desafio da pós-graduação Tech Developer 360 da Rocketseat. Sinta-se à vontade para usá-lo como inspiração!

Desenvolvido com 💜 por [Matheus Gabriel Valenga](https://github.com/usgmathe).
