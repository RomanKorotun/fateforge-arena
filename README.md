# Backend API (NestJS)

---

## Опис проєкту

Модульний backend на NestJS з наступними доменами:

- auth — автентифікація, OAuth, сесії
- users — профіль користувача
- admin — керування користувачами
- finance — гаманці, транзакції, платежі
- roulette — ігрова логіка

---

## ТЕХНОЛОГІЇ

Backend:

- Node.js
- NestJS
- TypeScript

Database:

- PostgreSQL — основна база даних
- Redis — сесії та кеш

ORM:

- Prisma ORM

Infra:

- Docker
- Docker Compose

---

## АУТЕНТИФІКАЦІЯ

Система автентифікації включає:

### OAuth провайдери:

- Google
- Discord
- LinkedIn
- Facebook

### Локальна авторизація:

- email + password

---

### Як працює auth flow:

1. користувач переходить на OAuth provider
2. отримує callback у backend
3. створюється або знаходиться користувач
4. генерується JWT токен
5. токен зберігається в **httpOnly cookie**
6. створюється сесія користувача

---

## СЕСІЇ

- сесії користувачів зберігаються в **Redis**
- кожен логін створює нову сесію
- підтримується:
  - revoke конкретної сесії
  - revoke всіх сесій (logout all devices)
  - перегляд активних сесій

---

## БІЗНЕС ЛОГІКА

### Finance:

- створення депозитів
- вивід коштів (withdraw)
- транзакції (transaction system)
- Stripe payments
- баланс формується тільки через transactions

### Roulette:

- створення ігрових сесій
- ставки (bets)
- розрахунок результатів гри
- історія ігор
- оновлення балансу через finance модуль

---

## USERS

- профіль користувача
- список користувачів
- avatar upload
- адреси користувача
- client seed (provably fair система)
- soft delete акаунта

---

## ADMIN

- список користувачів
- бан / розбан користувачів
- доступ тільки для ролі ADMIN

---

## ENVIRONMENT

Для локального запуску:

- створити файл `.env.development`
- базується на `.env.example`

---

## ЛОКАЛЬНИЙ ЗАПУСК

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build -d
```
