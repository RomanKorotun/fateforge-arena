import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient, UserRole } from '../generated/client.js';

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(` Environment variable ${name} is not set`);
  }
  return value;
}

const adapter = new PrismaPg({
  connectionString: getEnvOrThrow('DATABASE_URL'),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUsername = getEnvOrThrow('ADMIN_USERNAME');
  const adminEmail = getEnvOrThrow('ADMIN_EMAIL');
  const adminPassword = getEnvOrThrow('ADMIN_PASSWORD');

  const hashedPassword = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
