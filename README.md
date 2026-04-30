## 1. Використані технології

### Backend

- Node.js
- Nest.js

### База даних

- Redis — зберігання сесій користувачів
- PostgreSQL — основні дані (користувачі, профілі, адреси, ролі)

### ORM

- PrismaORM

### Інфраструктура

- Docker (Dockerfile, Docker Compose)

## 2. Загальні положення

2.1. Спочатку потрібно клонувати репозиторій на свій локальний комп'ютер

```bash
git clone url-репозиторія
```

2.2. Налаштування середовища

- У корені репозиторію створіть файл **.env.development**
- Заповніть його змінними середовища на основі прикладу з файлу **.env.example**

  2.3. Запустити Docker

  2.4. Відкрийте термінал у корені репозиторію та виконайте команду. Ця команда збирає образи і запускає контейнери у фоновому режимі.

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build -d
```

## 3. BACKEND

3.1. Щоб зайти в контейнер і виконувати команди всередині нього, використовуйте команду нижче. Тут node_container_dev — назва контейнера з docker-compose.yml.

```bash
docker exec -it node_container_dev sh
```

3.2. API маршрути

### USERS

GET /users/me — отримати інформацію про себе (профіль + адреса)  
POST /users/me/address — додати адресу користувача  
GET /users — список користувачів (обмежена інформація)  
DELETE /users/me — видалити акаунт (soft delete)

---

### ADMIN

GET /admin/users — отримання списку всіх користувачів (тільки ADMIN)  
PATCH /admin/users/:id/ban — блокування користувача  
PATCH /admin/users/:id/unban — розблокування користувача

---

### AUTH

POST /auth/signup — реєстрація користувача  
POST /auth/signin — авторизація користувача  
POST /auth/signout — вихід з поточного пристрою  
POST /auth/restore — відновлення акаунта

GET /auth/me — отримання поточного користувача  
GET /auth/sessions — отримання всіх активних сесій користувача

DELETE /auth/sessions/:id/revoke — видалення конкретної сесії  
DELETE /auth/sessions/revoke-all — видалення всіх сесій користувача (logout з усіх пристроїв)
