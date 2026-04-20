import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.lead.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  // 1. Create the 3 Store records
  const deepCleaning = await prisma.store.create({
    data: {
      slug: 'deep-cleaning',
      name: 'Deep Soft Cleaning',
      themeColor: '#10b981', // Emerald 500
      contactPhone: '[Insert Client Phone Number]',
      contactEmail: 'info@totally.co.za',
    },
  });

  const pressureCleaning = await prisma.store.create({
    data: {
      slug: 'pressure-cleaning',
      name: 'High Pressure Cleaning',
      themeColor: '#14b8a6', // Teal 500
      contactPhone: '[Insert Client Phone Number]',
      contactEmail: 'info@totally.co.za',
    },
  });

  const gifting = await prisma.store.create({
    data: {
      slug: 'gifting',
      name: 'PersonaLŸised Gifting',
      themeColor: '#f43f5e', // Rose 500
      contactPhone: '[Insert Client Phone Number]',
      contactEmail: 'info@totally.co.za',
    },
  });

  // 2. Create the 7 Service records for Deep Cleaning
  const deepCleaningServices = [
    {
      name: "Carpets",
      description: "Deep cleaning that removes embedded dirt, allergens, and tough stains for a fresh look and feel.",
      price: 450.00
    },
    {
      name: "Mattress",
      description: "Thorough sanitisation to eliminate dust mites, bacteria, and allergens, ensuring a healthier sleep.",
      price: 350.00
    },
    {
      name: "Vehicles",
      description: "Interior deep cleaning that lifts stains from seats, floors, and roofs, leaving your car spotless.",
      price: 650.00
    },
    {
      name: "Rug Rejuvenation",
      description: "Specialised treatment to revive delicate rugs, restoring their original vibrant patterns and texture.",
      price: 250.00
    },
    {
      name: "High Pressure (Outdoor)",
      description: "Powerful cleaning for roofs, windows, paving, and exterior walls to remove mould and grime.",
      price: 850.00
    },
    {
      name: "Upholstery (Couches & Chairs)",
      description: "Deep fabric cleaning that removes odours and stains, giving new life to your lounge and dining sets.",
      price: 550.00
    },
    {
      name: "Curtains",
      description: "Gentle yet effective cleaning that removes dust and pollutants without harming the fabric.",
      price: 150.00
    }
  ];

  for (const service of deepCleaningServices) {
    await prisma.service.create({
      data: {
        ...service,
        storeId: deepCleaning.id
      }
    });
  }

  // 3. Create dummy Leads
  await prisma.lead.createMany({
    data: [
      {
        storeId: deepCleaning.id,
        customerName: 'Ameera Khan',
        customerEmail: 'ameera@example.com',
        customerPhone: '082 111 2233',
        location: 'CBD',
        status: 'NEW',
        requestedDate: new Date('2026-04-25'),
      },
      {
        storeId: deepCleaning.id,
        customerName: 'Yusuf Isaacs',
        customerEmail: 'yusuf@example.com',
        customerPhone: '083 444 5566',
        location: 'Bellville',
        status: 'QUOTED',
        requestedDate: new Date('2026-04-27'),
      },
      {
        storeId: pressureCleaning.id,
        customerName: 'Sarah Smith',
        customerEmail: 'sarah@example.com',
        customerPhone: '084 777 8899',
        location: 'Northern Suburbs',
        status: 'NEW',
        requestedDate: new Date('2026-04-30'),
      }
    ]
  });

  console.log('Seed migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
