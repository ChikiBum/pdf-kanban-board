import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🚀 Починаємо перевірку бази даних...');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ З’єднання встановлено успішно!');
    console.log('Test result:', result);

    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 Доступні таблиці:');
    console.table(tables);
  } catch (error) {
    console.error('❌ Помилка при підключенні до бази даних:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
