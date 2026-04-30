import fs from 'fs/promises';
import path from 'path';

const SCHEMAS_DIR = path.resolve('prisma', 'schemas');

const FILES = ['base.prisma', 'users.prisma'];

const SCHEMA_PATH = path.resolve('prisma', 'schema.prisma');

async function buildSchema(): Promise<void> {
  try {
    const schemaParts = await Promise.all(
      FILES.map((file) => fs.readFile(path.join(SCHEMAS_DIR, file), 'utf-8')),
    );

    const schema = schemaParts.join('\n');
    await fs.writeFile(SCHEMA_PATH, schema, 'utf-8');
    console.log('schema.prisma built successfully!');
  } catch (err) {
    console.error('Failed to build schema.prisma:', err);
    process.exit(1);
  }
}

buildSchema();
