const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if categories already exist
  const existingCategories = await prisma.category.findMany();
  
  if (existingCategories.length > 0) {
    console.log(`Found ${existingCategories.length} existing categories. Skipping seed.`);
    return;
  }

  // Create categories using upsert to prevent duplicates
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Groceries' },
      update: {},
      create: {
        name: 'Groceries',
        icon: '🛒',
        color: '#FF6B6B'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Entertainment' },
      update: {},
      create: {
        name: 'Entertainment',
        icon: '🎮',
        color: '#4ECDC4'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Transportation' },
      update: {},
      create: {
        name: 'Transportation',
        icon: '🚗',
        color: '#45B7D1'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Shopping' },
      update: {},
      create: {
        name: 'Shopping',
        icon: '🛍️',
        color: '#96CEB4'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Bills & Utilities' },
      update: {},
      create: {
        name: 'Bills & Utilities',
        icon: '📄',
        color: '#FFEAA7'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Education' },
      update: {},
      create: {
        name: 'Education',
        icon: '🎓',
        color: '#DDA0DD'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Medical' },
      update: {},
      create: {
        name: 'Medical',
        icon: '🏥',
        color: '#FF7675'
      }
    })
  ]);

  console.log('Created/Updated categories:', categories.length);

  // No expenses - starting fresh for Suman K K
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
