import { PrismaClient } from '@prisma/client';

/**
 * Ми примусово передаємо порожній об'єкт __internal,
 * щоб "скинути" налаштування Wasm-клієнта, якщо він завантажився за замовчуванням.
 */
const prisma = new PrismaClient({
  // @ts-expect-error - це змусить клієнт використовувати бібліотеку
  __internal: {
    engine: {
      type: 'library',
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🚀 Починаємо перевірку бази даних...');
  try {
    // Спроба виконати простий запит
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ З’єднання встановлено успішно!');
    console.log('Результат тесту:', result);

    // Виведемо всі таблиці
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Таблиці в базі:');
    console.table(tables);
  } catch (error) {
    console.error('❌ Помилка підключення до бази:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
