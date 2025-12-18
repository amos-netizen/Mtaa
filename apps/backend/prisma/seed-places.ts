import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Common hospitals and services in Nairobi, Kenya
const nairobiPlaces = [
  // Hospitals
  {
    name: 'Kenyatta National Hospital',
    category: 'HOSPITAL',
    description: 'National referral hospital',
    address: 'Hospital Road, Nairobi',
    latitude: -1.3041,
    longitude: 36.8006,
    phoneNumber: '+254 20 2726300',
    verified: true,
  },
  {
    name: 'Aga Khan University Hospital',
    category: 'HOSPITAL',
    description: 'Private hospital',
    address: '3rd Parklands Avenue, Nairobi',
    latitude: -1.2658,
    longitude: 36.8083,
    phoneNumber: '+254 20 3662000',
    verified: true,
  },
  {
    name: 'Nairobi Hospital',
    category: 'HOSPITAL',
    description: 'Private hospital',
    address: 'Argwings Kodhek Road, Nairobi',
    latitude: -1.2804,
    longitude: 36.7894,
    phoneNumber: '+254 20 2846000',
    verified: true,
  },
  {
    name: 'Mater Misericordiae Hospital',
    category: 'HOSPITAL',
    description: 'Private hospital',
    address: 'Dunga Road, Parklands, Nairobi',
    latitude: -1.2644,
    longitude: 36.8061,
    phoneNumber: '+254 20 3740000',
    verified: true,
  },
  {
    name: 'MP Shah Hospital',
    category: 'HOSPITAL',
    description: 'Private hospital',
    address: 'Shivaji Road, Parklands, Nairobi',
    latitude: -1.2647,
    longitude: 36.8086,
    phoneNumber: '+254 20 3740000',
    verified: true,
  },
  // Pharmacies
  {
    name: 'Goodlife Pharmacy - Westlands',
    category: 'PHARMACY',
    description: '24-hour pharmacy',
    address: 'Westlands Mall, Nairobi',
    latitude: -1.2644,
    longitude: 36.8061,
    phoneNumber: '+254 20 4444444',
    verified: true,
  },
  {
    name: 'Goodlife Pharmacy - Sarit Centre',
    category: 'PHARMACY',
    description: 'Pharmacy chain',
    address: 'Sarit Centre, Westlands, Nairobi',
    latitude: -1.2647,
    longitude: 36.8086,
    phoneNumber: '+254 20 4444444',
    verified: true,
  },
  {
    name: 'Meds Pharmacy',
    category: 'PHARMACY',
    description: 'Pharmacy',
    address: 'Yaya Centre, Nairobi',
    latitude: -1.2804,
    longitude: 36.7894,
    phoneNumber: '+254 20 4444444',
    verified: true,
  },
  // Clinics
  {
    name: 'Avenue Healthcare',
    category: 'CLINIC',
    description: 'Medical clinic',
    address: 'Parklands, Nairobi',
    latitude: -1.2658,
    longitude: 36.8083,
    phoneNumber: '+254 20 4444444',
    verified: true,
  },
  {
    name: 'Gertrude\'s Children\'s Hospital',
    category: 'HOSPITAL',
    description: 'Children\'s hospital',
    address: 'Muthaiga Road, Nairobi',
    latitude: -1.2644,
    longitude: 36.8061,
    phoneNumber: '+254 20 7202000',
    verified: true,
  },
  // Banks
  {
    name: 'Equity Bank - Westlands',
    category: 'BANK',
    description: 'Bank branch',
    address: 'Westlands, Nairobi',
    latitude: -1.2647,
    longitude: 36.8086,
    phoneNumber: '+254 20 4444444',
    verified: true,
  },
  {
    name: 'KCB Bank - Parklands',
    category: 'BANK',
    description: 'Bank branch',
    address: 'Parklands, Nairobi',
    latitude: -1.2658,
    longitude: 36.8083,
    phoneNumber: '+254 20 3274000',
    verified: true,
  },
  // Police Stations
  {
    name: 'Parklands Police Station',
    category: 'POLICE_STATION',
    description: 'Police station',
    address: 'Parklands, Nairobi',
    latitude: -1.2644,
    longitude: 36.8061,
    phoneNumber: '999',
    verified: true,
  },
  {
    name: 'Westlands Police Station',
    category: 'POLICE_STATION',
    description: 'Police station',
    address: 'Westlands, Nairobi',
    latitude: -1.2647,
    longitude: 36.8086,
    phoneNumber: '999',
    verified: true,
  },
];

// Common places in Mombasa
const mombasaPlaces = [
  {
    name: 'Coast General Hospital',
    category: 'HOSPITAL',
    description: 'Public hospital',
    address: 'Mombasa',
    latitude: -4.0435,
    longitude: 39.6682,
    phoneNumber: '+254 41 2220000',
    verified: true,
  },
  {
    name: 'Aga Khan Hospital Mombasa',
    category: 'HOSPITAL',
    description: 'Private hospital',
    address: 'Vanga Road, Mombasa',
    latitude: -4.0435,
    longitude: 39.6682,
    phoneNumber: '+254 41 2220000',
    verified: true,
  },
];

async function main() {
  console.log('🌱 Seeding places...');

  // Get or create a default neighborhood (Nairobi)
  let nairobiNeighborhood = await prisma.neighborhood.findFirst({
    where: { name: { contains: 'Nairobi', mode: 'insensitive' } },
  });

  if (!nairobiNeighborhood) {
    nairobiNeighborhood = await prisma.neighborhood.create({
      data: {
        name: 'Nairobi Central',
        city: 'Nairobi',
        county: 'Nairobi County',
        centerLatitude: -1.2921,
        centerLongitude: 36.8219,
      },
    });
  }

  // Seed Nairobi places
  for (const place of nairobiPlaces) {
    await prisma.place.upsert({
      where: {
        // Use name + category as unique identifier
        id: `${place.name}-${place.category}`.toLowerCase().replace(/\s+/g, '-'),
      },
      update: place,
      create: {
        ...place,
        neighborhoodId: nairobiNeighborhood.id,
      },
    });
  }

  // Get or create Mombasa neighborhood
  let mombasaNeighborhood = await prisma.neighborhood.findFirst({
    where: { name: { contains: 'Mombasa', mode: 'insensitive' } },
  });

  if (!mombasaNeighborhood) {
    mombasaNeighborhood = await prisma.neighborhood.create({
      data: {
        name: 'Mombasa Central',
        city: 'Mombasa',
        county: 'Mombasa County',
        centerLatitude: -4.0435,
        centerLongitude: 39.6682,
      },
    });
  }

  // Seed Mombasa places
  for (const place of mombasaPlaces) {
    // Check if place already exists by name and location
    const existing = await prisma.place.findFirst({
      where: {
        name: place.name,
        latitude: { gte: place.latitude - 0.01, lte: place.latitude + 0.01 },
        longitude: { gte: place.longitude - 0.01, lte: place.longitude + 0.01 },
      },
    });

    if (!existing) {
      await prisma.place.create({
        data: {
          ...place,
          neighborhoodId: mombasaNeighborhood.id,
        },
      });
    }
  }

  console.log('✅ Places seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding places:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

