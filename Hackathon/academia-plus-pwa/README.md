# Academia+

Academia+ é uma PWA de rede social e marketplace estudantil. A aplicação permite cadastro, login, feed de publicações, perfil, comunidades, chat, produtos salvos, seguidores, curtidas e comentários.

## Execução

Pré-requisito: Node.js 20.19+ ou 22.12+.

Instale as dependências:

```sh
npm install
```

Rode a API REST:

```sh
npm run api:dev
```

Rode o frontend PWA em outro terminal:

```sh
npm run dev
```

URLs:

- API: `http://localhost:3000`
- PWA: `http://localhost:5173`

Builds de validação:

```sh
npm run api:build
npm run build
```

## Contas Seed

```txt
admin@teste.com / 123
user@teste.com / 123456
```

## Tecnologias

Frontend:

- Vue.js 3
- TypeScript
- Vite
- Vue Router
- Pinia
- PrimeVue
- Tailwind CSS
- PWA com Service Worker

Backend:

- Node.js
- TypeScript
- Express
- JWT com HMAC SHA-256 usando `node:crypto`
- Zod para validação
- Banco JSON local integrado
- Schema SQL de referência

## MVP Atendido

Telas obrigatórias:

- Cadastro de usuário
- Login com autenticação
- Feed de publicações
- Perfil do usuário

Funcionalidades obrigatórias:

- Criar e visualizar posts pela API
- Curtir e descurtir publicações
- Comentar posts
- Seguir e deixar de seguir usuários
- Visualizar perfil próprio
- Visualizar perfil de outros usuários
- Navegar pelo feed, perfil, chat, comunidades e marketplace

## Backend

O backend segue arquitetura em camadas:

- `server/entities`: entidades de domínio.
- `server/repositories`: acesso e persistência dos dados.
- `server/services`: regras de negócio.
- `server/controllers`: entrada HTTP e respostas REST.
- `server/routes`: definição dos endpoints.
- `server/middlewares`: autenticação, autorização, validação e tratamento de erro.

Entidades obrigatórias:

- `User`
- `Post`
- `Like`
- `Comment`
- `Follow`

Relacionamentos:

- Usuário cria posts.
- Usuário curte posts.
- Usuário comenta posts.
- Usuário segue outros usuários.

Banco de dados:

- Banco local funcional: `server/database/app-db.json`
- Modelagem relacional de referência: `server/database/schema.sql`

Autenticação:

- Login e cadastro retornam JWT.
- Rotas protegidas exigem `Authorization: Bearer <token>`.

## Endpoints

Autenticação:

- `POST /auth/register`
- `POST /auth/login`

Usuários:

- `GET /users/me`
- `PUT /users/me`
- `GET /users/search?q=larissa`
- `GET /users/:id`

Posts:

- `GET /posts?page=1&size=10`
- `POST /posts`
- `POST /posts/:id/like`
- `DELETE /posts/:id/like`
- `POST /posts/:id/comments`

Seguidores:

- `POST /follows/:id`
- `DELETE /follows/:id`

Notificações:

- `GET /notifications`

Exemplo de header protegido:

```txt
Authorization: Bearer <token>
```

## Funcionalidades Opcionais

- Busca de usuários.
- Edição de perfil.
- Notificações simplificadas.
- Paginação no feed.
- Suporte a tema claro/escuro no perfil via campo `theme`.
- Chat com persistência local.
- Produtos salvos.
- Seguir vendedor.
- Fluxo de interesse em produto abrindo conversa automaticamente.

## Critérios de Avaliação

25% - MVP atendido:

- Cadastro, login, feed e perfil estão implementados.
- Posts, curtidas, comentários e seguidores existem na API.
- A interface tem fluxos de marketplace, comunidades e chat.

20% - Backend:

- Camadas `Entity`, `Repository`, `Service` e `Controller`.
- API REST com endpoints documentados.
- JWT em rotas protegidas.
- Banco integrado e schema SQL.
- Relacionamentos entre usuários, posts, likes, comments e follows.

20% - Usabilidade, navegação e experiência:

- Navegação por rotas.
- Feed com abas e filtros.
- Busca com feedback quando não encontra resultados.
- Chat, comunidades e detalhe de produto conectados.
- Ações de salvar, curtir, seguir e conversar.

15% - Interface visual e responsividade:

- Identidade visual roxo/lilás e verde.
- Layout responsivo para PWA.
- Telas adaptadas para desktop, notebook, tablet e mobile.
- Componentes com contraste e estados visuais.

10% - Criatividade e diferenciais:

- Marketplace estudantil integrado ao feed.
- Comunidades por instituição e curso.
- Chat iniciado a partir de produtos.
- Preferências de comunidade.
- Notificações simplificadas.

