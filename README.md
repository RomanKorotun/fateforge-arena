# Backend API

---

## Опис проєкту

Модульний backend на NestJS з наступними доменами:

- auth — автентифікація, OAuth, сесії
- users — профіль користувача
- admin — керування користувачами
- finance — гаманці, транзакції, платежі
- roulette — ігрова логіка
- roulette — ігрова логіка рулетки, ставки та обробка раундів
- videoslot — логіка слот-гри, спіни та розрахунок виграшів
- chat - логіка для створення чат-кімнат, додавання та видалення користувачів до кімнат, збереження повідомлень

---

## ТЕХНОЛОГІЇ

Backend:

- Node.js
- NestJS
- TypeScript

Database:

- PostgreSQL
- Redis

ORM:

- Prisma ORM

Infra:

- Docker
- Docker Compose

---

## SWAGGER (API Documentation)

Проєкт використовує Swagger для документування API.

### Доступ до Swagger:

- **Development:**  
  `http://localhost:3799/swagger`

- **Production:**  
  `https://fateforge-arena.duckdns.org/swagger`

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

### Як передається токен:

- токен зберігається в **httpOnly cookie**

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
- вивід коштів
- транзакції
- Stripe payments
- баланс формується тільки через transactions

### Roulette:

- створення ігрових сесій
- ставки (bets)
- розрахунок результатів гри
- історія ігор
- оновлення балансу через finance модуль

---

## USER

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

## CHAT

Socket Events:

Client → Server:

- room:join // @SubscribeMessage('room:join') - зайти в кімнату, отримати users + history
- room:leave // @SubscribeMessage('room:leave') - вийти з кімнати, оновити users
- message:send // @SubscribeMessage('message:send') - відправити повідомлення

Server → Client:

- room:users // this.server.to(room).emit('room:users') - список онлайн користувачів
- chat:init // client.emit('chat:init') - історія повідомлень після join
- message:new // this.server.to(room).emit('message:new') - нове повідомлення всім

## ENVIRONMENT

Для локального запуску:

- створити файл `.env.development`
- базується на `.env.example`

---

## ЛОКАЛЬНИЙ ЗАПУСК

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build -d
```

## DEPLOYMENT

Проєкт **задеплоєний на власному VPS (Linux server)**.

- Усі сервіси запущені в контейнерах через Docker Compose
- Nginx reverse proxy

## CI/CD (GitHub Actions)

Проєкт використовує автоматизований CI/CD пайплайн на базі **GitHub Actions**.

Після кожного `push` у гілку `main` запускається CI/CD процес:

### CI (Continuous Integration)

- встановлення залежностей
- перевірка тестів
- збірка проєкту

### CD (Continuous Deployment)

Після успішного CI автоматично виконується деплой на VPS:

- підключення до VPS через SSH (GitHub Secrets)
- `git pull` останніх змін
- пересборка тільки Node.js API Docker контейнера
- перезапуск API сервісу
- застосування Prisma міграцій
- очищення старих Docker image

### Результат

Після завершення pipeline нова версія backend автоматично розгортається на production сервері без ручного втручання.
