import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default neighborhoods in Nairobi
  const neighborhoods = [
    { name: 'Kilimani' },
    { name: 'Westlands' },
    { name: 'Kasarani' },
    { name: 'Kibera' },
    { name: 'Donholm' },
  ];

  for (const neighborhood of neighborhoods) {
    const existing = await prisma.neighborhood.findFirst({
      where: { name: neighborhood.name },
    });
    
    if (!existing) {
      await prisma.neighborhood.create({
        data: neighborhood,
      });
      console.log(`✅ Created neighborhood: ${neighborhood.name}`);
    } else {
      console.log(`⏭️  Neighborhood already exists: ${neighborhood.name}`);
    }
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




