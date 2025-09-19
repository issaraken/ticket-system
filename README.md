# Ticket System

A full-stack ticket management system built with NestJS (Backend API) and Next.js (Frontend).

## Backend Setup

```bash
cd ticket-api
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://ticket_user:ticket_password@localhost:5432/ticket_db"
DB_NAME=ticket_db
DB_USER=ticket_user
DB_PASSWORD=ticket_password
DB_PORT=5432
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
NODE_ENV=development
```

Start services and run:

```bash
docker-compose up postgres redis -d
npm run db:setup
npm run start:dev
```

API available at: `http://localhost:3000`

## Frontend Setup

```bash
cd ticket-web
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start development server:

```bash
npm run dev
```

Web application available at: `http://localhost:30000`
