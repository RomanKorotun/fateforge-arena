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

---

# AUTH

GET /auth/google — редірект на Google OAuth  
GET /auth/google/callback — callback після Google OAuth

GET /auth/linkedin — редірект на LinkedIn OAuth  
GET /auth/linkedin/callback — callback після LinkedIn OAuth

GET /auth/discord — редірект на Discord OAuth  
GET /auth/discord/callback — callback після Discord OAuth

GET /auth/facebook — редірект на Facebook OAuth  
GET /auth/facebook/callback — callback після Facebook OAuth

POST /auth/signup — реєстрація користувача  
POST /auth/signin — авторизація користувача  
POST /auth/restore — відновлення акаунта

GET /auth/me — отримати поточного користувача  
GET /auth/sessions — отримати всі активні сесії

DELETE /auth/sessions/:id/revoke — відкликати конкретну сесію  
DELETE /auth/sessions/revoke-all — відкликати всі сесії (logout all devices)

POST /auth/signout — вихід з поточної сесії

GET /auth/confirm-email?token= — підтвердження email  
POST /auth/email-verification/resend — повторна відправка email verification

---

# USERS

GET /users/me — отримати свій профіль  
POST /users/me/profile/avatar — завантажити аватар

POST /users/me/address — додати адресу  
GET /users/me/address — отримати адресу  
PUT /users/me/address — оновити адресу

GET /users — список користувачів (обмежена інформація)  
DELETE /users/me — soft delete акаунта

POST /users/me/client-seed — створити client seed  
PUT /users/me/client-seed — оновити client seed

---

# ADMIN

GET /admin/users — список всіх користувачів (ADMIN only)  
PATCH /admin/users/:id/ban — забанити користувача  
PATCH /admin/users/:id/unban — розбанити користувача

finance/
│
├── domain/
│ ├── entities/
│ │ ├── wallet.entity.ts
│ │ ├── transaction.entity.ts
│ │
│ ├── enums/
│ │ ├── transaction-type.enum.ts
│ │ ├── transaction-status.enum.ts
│ │ ├── payment-provider.enum.ts
│ │
│ ├── repositories/
│ ├── wallet.repository.ts
│ ├── transaction.repository.ts
│  
│  
│  
│  
│
├── application/
│ ├── use-cases/
│ │ ├── create-deposit.use-case.ts
│ │ ├── withdraw.use-case.ts
│ │ ├── handle-payment-webhook.use-case.ts
│ │
│ ├── dto/
│ │ ├── create-deposit.dto.ts
│ │ ├── withdraw.dto.ts
│ │ ├── webhook.dto.ts
│
│
├── infrastructure/
│ ├── persistence/
│ │ ├── prisma/
│ │ │ ├── wallet.repository.prisma.ts
│ │ │ ├── transaction.repository.prisma.ts
│ │
│ ├── payment-providers/
│ │ ├── liqpay.provider.ts
│ │ ├── stripe.provider.ts
│ │ ├── paypal.provider.ts
│
│ ├── unit-of-work/
│ │ ├── prisma-unit-of-work.ts
│
│
├── presentation/
│ ├── controllers/
│ │ ├── finance.controller.ts
│ │ ├── wallet.controller.ts
│ │
│ ├── webhooks/
│ │ ├── liqpay.webhook.controller.ts
│ │ ├── stripe.webhook.controller.ts
│ │ ├── paypal.webhook.controller.ts
│
│
└── finance.module.ts

import { Injectable } from '@nestjs/common';
import \* as crypto from 'crypto';

@Injectable()
export class LiqPayProvider {
private publicKey = process.env.PUBLIC_KEY_LIQPAY!;
private privateKey = process.env.PRIVATE_KEY_LIQPAY!;

generateCheckout(input: {
amount: number;
currency: string;
orderId: string;
description?: string;
resultUrl: string;
serverUrl: string;
}) {
const data = {
version: 3,
public_key: this.publicKey,
action: 'pay',
amount: input.amount,
currency: input.currency,
description: input.description ?? 'Deposit',
order_id: input.orderId,
result_url: input.resultUrl,
server_url: input.serverUrl,
};

    const dataString = Buffer.from(JSON.stringify(data)).toString('base64');

    const signature = crypto
      .createHash('sha1')
      .update(this.privateKey + dataString + this.privateKey)
      .digest('base64');

    return {
      data: dataString,
      signature,
    };

}
}

      // walletId: data.walletId,
      // type: data.type,
      // status: data.status,
      // amount: new Decimal(data.amount),
      // currency: data.currency,
      // ...(data.provider && { provider: data.provider }),
      // ...(data.orderId && { orderId: data.orderId }),
      // ...(data.providerPaymentId && { providerPaymentId: data.providerPaymentId }),
      // ...(data.idempotencyKey && { idempotencyKey: data.idempotencyKey }),
      // ...(data.description && { description: data.description }),
