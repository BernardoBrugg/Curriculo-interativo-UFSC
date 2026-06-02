# Curriculo Interativo

Ferramenta web para explorar o curriculo de Engenharia de Producao da UFSC
(matriz 2023.1), acompanhar progresso e visualizar relacoes de pre-requisitos.

## Features

- Landing page em `/` com apresentacao da ferramenta.
- Aplicacao interativa em `/app`.
- Progresso persistido em `localStorage`.
- Busca por codigo ou nome da disciplina.
- Destaque visual de pre-requisitos e dependencias.
- Tema claro/escuro com toggle por icone.
- Tema escuro sobrio em preto/cinza, sem paleta azul.
- Regras de optativas visiveis: minimo 324h-a do curso e ate 108h-a livres.
- Rodape full width com links para LinkedIn e GitHub do autor.
- UI responsiva com gradientes, glassmorphism e transicoes suaves.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- `next/font` com Geist

## Como rodar

```bash
npm install
npm run dev
```

Acesse:

- Landing page: `http://localhost:3000`
- Ferramenta: `http://localhost:3000/app`

## Verificacao

```bash
npm run lint
npm run build
```

## Dados

Os dados do curriculo ficam em `src/data`. A aplicacao nao usa backend,
autenticacao ou banco de dados. O progresso do usuario e salvo localmente pela
chave `curriculo-eps-status`.

## Tema

A preferencia de tema usa a chave `curriculo-theme` no `localStorage`, com os
valores `light` ou `dark`. Quando nao ha preferencia salva, a primeira carga usa
a preferencia do sistema.
