import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './database';

export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: './backend/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Auto-run migrations in development
if (process.env.NODE_ENV !== 'production') {
  runMigrations().catch(console.error);
}