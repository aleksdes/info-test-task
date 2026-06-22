# Info Test Task

Monorepo с бэкендом (Express + TypeScript) и фронтендом (Vue 3 + Vite).

## Разворачивание

```bash
# 1. Установка зависимостей
pnpm install

# 2. Скопировать .env.example в .env
cp .env.example .env

# 3. Собрать бэкенд
pnpm build:backend

# 4. Сгенерировать API-хелперы для фронтенда
pnpm generate-api:frontend

# 5. Запустить dev-режим (бэкенд + фронтенд одновременно)
pnpm dev
```

## Структура

- `apps/backend` — Express-сервер, отдаёт данные воркфлоу из JSON-файлов, Swagger-документация по `/openapi.json`
- `apps/frontend` — Vue 3 SPA (Pinia, PrimeVue, VueFlow, TypeScript)
