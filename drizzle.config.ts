import { getFullEnv } from '@/env/configs';
import { defineConfig } from 'drizzle-kit';

const { databaseFile, drizzleMigrationsFolder, drizzleSchemaFile } =
  getFullEnv();

export default defineConfig({
  out: drizzleMigrationsFolder,
  schema: drizzleSchemaFile,
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseFile,
  },
});
