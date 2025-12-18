import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default neighborhoods in Nairobi
  const neighborhoods = [
    { name: 'Kilimani', city: 'Nairobi' },
    { name: 'Westlands', city: 'Nairobi' },
    { name: 'Kasarani', city: 'Nairobi' },
    { name: 'Kibera', city: 'Nairobi' },
    { name: 'Donholm', city: 'Nairobi' },
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

  // Create test user
  const testUserEmail = 'testuser@mtaa.com';
  const existingTestUser = await prisma.user.findUnique({
    where: { email: testUserEmail },
  });

  if (!existingTestUser) {
    const hashedPassword = await bcrypt.hash('Test@1234', 10);
    await prisma.user.create({
      data: {
        fullName: 'Test User',
        username: 'testuser',
        email: testUserEmail,
        phoneNumber: '0712345678',
        passwordHash: hashedPassword,
      },
    });
    console.log(`✅ Created test user: ${testUserEmail}`);
  } else {
    console.log(`⏭️  Test user already exists: ${testUserEmail}`);
  }

  // Seed places data
  try {
    console.log('🏥 Seeding places data...');
    const { execSync } = require('child_process');
    execSync('npx ts-node prisma/seed-places.ts', { stdio: 'inherit' });
    console.log('✅ Places data seeded');
  } catch (error) {
    console.log('⏭️  Places seeding skipped (may already exist)');
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




