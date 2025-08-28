import type { Config } from 'drizzle-kit';

export default {
  schema: './backend/infrastructure/database.ts',
  out: './backend/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/consciousness',
  },
} satisfies Config;