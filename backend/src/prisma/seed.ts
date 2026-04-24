import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = [
    { id: 1, name: 'Пользователь' },
    { id: 2, name: 'Администратор' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }

  const statuses = [
    { id: 1, name: 'Активен' },
    { id: 2, name: 'Заблокирован' },
  ];

  for (const status of statuses) {
    await prisma.status.upsert({
      where: { id: status.id },
      update: {},
      create: status,
    });
  }

  console.log('Базовые данные синхронизированы');
}

main()
  .catch((e) => {
    console.error('Ошибка при выполнении сида:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
