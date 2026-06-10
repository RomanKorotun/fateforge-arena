# FateForge Arena — Backend API

---

## Domains

- **auth** — authentication (JWT, OAuth, sessions)
- **users** — user profile management
- **admin** — user moderation (ban/unban)
- **finance** — wallets, transactions, payments
- **roulette** — roulette game logic, bets
- **videoslot** — slot machine logic, spins, payouts
- **chat** — real-time chat (rooms, messages, users management)

---

## Environments

### Production

- API: https://fateforge-arena.duckdns.org
- Frontend: https://fateforge-arena-frontend.netlify.app
- Swagger: https://fateforge-arena.duckdns.org/swagger

### Development

- Swagger: http://localhost:3799/swagger

---

## Tech Stack

### Backend

- Node.js
- NestJS
- TypeScript

### Database

- PostgreSQL
- Redis

### ORM

- Prisma ORM

### Infrastructure

- Docker
- Docker Compose

---

## Authentication

### Authentication Methods

- OAuth authentication (Google, Discord, LinkedIn, Facebook)
- Email & password authentication

### Token Storage

- Access token is stored in **httpOnly secure cookies**
- Protected against XSS attacks
- Automatically included in all API requests

---

## Sessions

- User sessions are stored in **Redis**
- Each login creates a new session
- Supports session management:
  - Revoke specific session
  - Revoke all sessions (logout from all devices)
  - View active user sessions

---

## Business Logic

### Finance

- Deposits and withdrawals
- Transactions-based balance system
- Payment processing via Stripe

### Games

#### Roulette

- Game sessions with betting system
- Round result calculation
- Player history tracking

#### Video Slot

- Slot spins
- Win calculation system
- Player history tracking

### User

- User profiles
- Avatar management
- Account soft delete
- Account restoration

### Admin

- User management
- Ban / unban system
- Role-based access control (ADMIN only)

### Chat

- Real-time chat rooms
- Messaging system via WebSockets
- Room-based communication

---

## Local Setup

### 1. Clone the repository

git clone <repo-url>  
cd fateforge-arena-backend

### 2. Create environment file

Inside the project root, create a `.env.development` file based on `.env.example`

### 3. Run the project with Docker

Open a terminal in the root of the project and execute the following command:

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build -d
```

### Result

After running the command:

- All services will be started in Docker containers
- Backend API will be available locally
- Database and other dependencies will be initialized automatically

---

## DEPLOYMENT

The project is deployed on a self-managed **VPS (Linux server)**.

- All services run in **Docker containers** using Docker Compose
- **Nginx** is used as a reverse proxy for routing and handling incoming traffic

## CI/CD (GitHub Actions)

The project uses an automated CI/CD pipeline based on **GitHub Actions**.

After every `push` to the `main` branch, the CI/CD workflow is triggered automatically.

### CI (Continuous Integration)

- Install dependencies
- Run tests
- Build the project

### CD (Continuous Deployment)

After a successful CI stage, the application is automatically deployed to the VPS:

- Connect to the VPS via SSH (using GitHub Secrets)
- Pull the latest changes from the repository
- Rebuild only the Node.js API Docker container
- Restart the API service
- Run Prisma migrations
- Clean up old Docker images

### Result

After the pipeline completes, the new version of the backend is automatically deployed to the production server without any manual intervention.

---

## Architecture

### Application flow

Frontend  
↓  
Nginx (Reverse Proxy)  
↓  
NestJS API  
↓  
PostgreSQL | Redis

### Infrastructure

VPS (Linux Server)  
↓  
Docker Compose  
↓  
Containers:

- Nginx
- NestJS API
- PostgreSQL
- Redis
