# CivicConnect Backend

This is the backend API for the CivicConnect mobile-first social media application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
   ```bash
   cd backend
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Generate Prisma client:
   ```bash
   pnpm prisma:generate
   ```

4. Push schema to database (or use migrations in production):
   ```bash
   pnpm prisma:push
   ```

5. Seed the database (optional):
   ```bash
   pnpm prisma:seed
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3001`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run database migrations |
| `pnpm prisma:push` | Push schema changes to database |
| `pnpm prisma:seed` | Seed the database with sample data |
| `pnpm prisma:studio` | Open Prisma Studio GUI |

## API Endpoints

See [/docs/backend-spec.md](/docs/backend-spec.md) for complete API documentation.

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/users/profile` | Get current user profile |
| GET | `/api/posts/feed` | Get posts feed |
| GET | `/api/schemes` | List government schemes |
| GET | `/api/jobs` | List job opportunities |
| GET | `/api/events` | List events |
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/emergency-alerts` | Get emergency alerts |

## Test Credentials

After running the seed script:

- **Email**: `priya@example.com`
- **Password**: `password123`

## Project Structure

```
backend/
├── src/
│   ├── routes/            # Express route handlers
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth, validation, error handling
│   ├── services/          # Reusable service functions
│   ├── app.ts             # Express app setup
│   └── server.ts          # Server entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── .env.example           # Environment template
├── package.json
└── tsconfig.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for access tokens | Required |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Required |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## MVP Constraints

This backend follows MVP constraints for rapid development:

- **Post engagement**: Simple counter fields (no relation tables)
- **Refresh tokens**: Stateless JWT (no database storage)
- **Image uploads**: Placeholder URLs (integrate Supabase Storage later)
- **Supabase**: PostgreSQL only (custom JWT, no Supabase Auth)

## License

MIT
