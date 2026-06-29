# Academia+

Academia+ e uma PWA de rede social e marketplace estudantil. O projeto une feed, perfil, comunidades, chat e compra/venda de materiais entre estudantes.

## O que e front e o que e back

Frontend:

- Pasta principal: `src`
- Framework: Vue 3 com TypeScript
- Rotas e telas: login, cadastro, feed, marketplace, perfil, chat, comunidades e admin
- Estado local: Pinia e objetos em `src/store.ts`
- PWA: `public/manifest.webmanifest` e `public/service-worker.js`

Backend:

- Pasta principal: `server`
- Framework: Express com TypeScript
- API REST com controllers, services, repositories, schemas e middlewares
- Autenticacao com JWT
- Banco JSON local em `server/database/app-db.json`
- Schema SQL de referencia em `server/database/schema.sql`

## Como rodar

Pre-requisito: Node.js 20.19+ ou 22.12+.

Instale as dependencias:

```sh
npm install
```

Rode a API em um terminal:

```sh
npm run api:dev
```

Rode o front PWA em outro terminal:

```sh
npm run dev
```

URLs principais:

- Front/PWA: `http://localhost:5173`
- API: `http://localhost:3000`

Para servir as mesmas telas do PWA pela API:

```sh
npm run build
npm run api:build
npm run api:start
```

Depois acesse:

- API com telas do PWA: `http://localhost:3000`
- Login/onboarding: `http://localhost:3000/login`

Comandos de validacao:

```sh
npm run type-check
npm run api:build
npm run build
```

## Contas para avaliacao

Conta principal recomendada:

```txt
larissa@aluno.ifce.edu.br / 123456
```

Contas demo:

```txt
admin@teste.com / 123
joao@email.com / 123456
```

## Criacao de novas contas

Novas contas podem ser criadas pela tela "Criar conta".

O fluxo funciona assim:

- Se a API estiver rodando, o cadastro chama `POST /auth/register`.
- A API salva o usuario em `server/database/app-db.json`.
- Se a API nao estiver ligada, o front salva a conta no `localStorage` para a banca conseguir testar o fluxo mesmo sem back ativo.
- Nao e permitido cadastrar duas contas com o mesmo e-mail.

Regra de verificacao estudantil:

- Com e-mail institucional, a conta entra como estudante verificado.
- Exemplos aceitos: `.edu.br`, `@usp.br`, `@ufrj.br`, `@aluno.unifesp.br`, `@aluno.ifce.edu.br`.
- Com e-mail nao institucional, a pessoa precisa enviar uma declaracao de matricula no cadastro.
- A declaracao pode ser PDF ou imagem.

## Uploads e destino dos dados

O projeto nao usa servidor de arquivos separado. Os uploads sao tratados como dados em base64/URL dentro do proprio fluxo da aplicacao.

Declaracao de matricula:

- O arquivo e lido no front com `FileReader`.
- O nome do arquivo vai no campo `enrollmentDocumentName`.
- O conteudo base64 vai no campo `enrollmentDocumentData`.
- Quando a API esta ligada, esses campos seguem no `POST /auth/register`.
- O backend aceita esses campos no schema de cadastro e salva o usuario em `server/database/app-db.json`.
- Quando a API nao esta ligada, os mesmos campos ficam no `localStorage` do navegador.

Foto do produto publicado pelo perfil:

- A publicacao do item fica concentrada no perfil do usuario, no menu de tres pontinhos.
- O marketplace nao tem mais botao proprio de "Publicar item".
- A imagem escolhida para o produto e lida no front com `FileReader`.
- A imagem aparece como preview antes da publicacao.
- Ao publicar, a imagem base64 vira a foto do produto no estado do front/PWA.
- Esse produto aparece em "Minhas publicacoes" e no marketplace estudantil durante a sessao.

Observacao tecnica:

- A API atual de produtos ainda e um catalogo simples em memoria, com `name`, `price`, `stock` e `categoryId`.
- Por isso, a publicacao rica do perfil, com foto, vendedor, instituicao e localizacao, fica no estado do front.
- O cadastro de usuario e a declaracao de matricula ja estao integrados ao backend de autenticacao.

## Funcionalidades atendidas

Telas obrigatorias:

- Cadastro de usuario
- Login com autenticacao
- Feed de publicacoes
- Perfil do usuario

Funcionalidades principais:

- Criar conta com e-mail institucional ou declaracao de matricula
- Login com conta real da API ou contas demo
- Feed com posts, curtidas e comentarios
- Seguir e deixar de seguir usuarios
- Visualizar perfil proprio e outros perfis
- Marketplace estudantil
- Publicar item pelo perfil, com upload de foto do produto
- Produtos salvos
- Chat
- Comunidades por instituicao e gerais
- Stories clicaveis com viewer estilo Instagram: tela cheia, stories laterais visíveis, barra de progresso e navegação por toque, teclado e setas

## Endpoints principais

Autenticacao:

- `POST /auth/register`
- `POST /auth/login`

Usuarios:

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

Notificacoes:

- `GET /notifications`

Rotas protegidas usam:

```txt
Authorization: Bearer <token>
```

## Estrutura do backend

- `server/entities`: entidades de dominio
- `server/repositories`: acesso e persistencia dos dados
- `server/services`: regras de negocio
- `server/controllers`: entrada HTTP e respostas REST
- `server/routes`: definicao dos endpoints
- `server/schemas`: validacao com Zod
- `server/middlewares`: autenticacao, autorizacao, validacao e erros

Entidades obrigatorias:

- `User`
- `Post`
- `Like`
- `Comment`
- `Follow`

Relacionamentos:

- Usuario cria posts.
- Usuario curte posts.
- Usuario comenta posts.
- Usuario segue outros usuarios.

## Diferenciais

- PWA instalavel
- Interface unificada entre front PWA e API servindo build
- Marketplace integrado ao perfil
- Upload de foto para produto no perfil
- Cadastro com verificacao academica
- Comunidades por instituicao, curso e geral
- Stories com viewer estilo Instagram (tela cheia, navegação entre stories, progresso automático, resposta vinculada ao chat)
- Chat iniciado a partir de interesse em produto
