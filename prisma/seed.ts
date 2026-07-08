import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Clear all existing data
  await prisma.lead.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  // ─── 1. DEEP CLEANING ───────────────────────────────────────────────────────
  const deepCleaning = await prisma.store.create({
    data: {
      slug: 'deep-cleaning',
      name: 'Deep Soft Cleaning',
      themeColor: '#10b981',
      contactPhone: '[Insert Client Phone Number]',
      contactEmail: 'info@totally.co.za',
      pageTitle: 'Professional Deep Cleaning Services | TotalLŸ',
      pageDescription: 'Expert deep cleaning for carpets, mattresses, vehicles, and upholstery. Ihsaan-driven service excellence across Cape Town.',
      tagline: 'Premium Soft Cleaning',
      heroHeadline: 'TotalLŸ Deep Cleaning',
      missionText: 'What truly sets us apart is not just the quality of our cleaning, but the way we work with people and the efficiency we bring to every job.',
      servicesHeadline: 'Our Specialised Services',
      servicesDescription: 'Professional deep cleaning solutions for every surface. From delicate upholstery to industrial carpets, we bring excellence to every job.',
      aboutHeading: 'Our Journey & Core Values',
      aboutUsText: 'TotalLŸ was born from the vision of young entrepreneurs who wanted to redefine service excellence in South Africa. Guided by our Islamic school mentor, we embarked on this journey with a commitment to something deeper than just cleaning.\n\nAt the heart of everything we do are the values of honesty, fairness, trust, and ihsaan (excellence). We believe that being thorough in our work is an act of integrity, and we treat every home and office with the same respect we would our own.',
      testimonialText: 'The TotalLŸ team brings a level of professionalism and efficiency that is rare. Their commitment to ihsaan is visible in every corner they clean.',
      testimonialAuthor: 'Moulana Luqmaan',
      testimonialAuthorRole: 'Community Leader',
      address: 'Cape Town, South Africa',
      instagramUrl: 'https://instagram.com/cleandeep',
      facebookUrl: 'https://facebook.com/cleandeep',
      tiktokUrl: 'https://tiktok.com/@cleandeep',
      galleryImages: [
        { url: '/images/deep-cleaning/carpet-before-after.jpg', caption: 'Carpet — Before & After' },
        { url: '/images/deep-cleaning/sofa-before-after.jpg',   caption: 'Sofa Upholstery — Before & After' },
      ],
    },
  });

  const deepCleaningServices = [
    { name: 'Carpets',                       description: 'Deep cleaning that removes embedded dirt, allergens, and tough stains for a fresh look and feel.',                              price: 450 },
    { name: 'Mattress',                      description: 'Thorough sanitisation to eliminate dust mites, bacteria, and allergens, ensuring a healthier sleep.',                           price: 350 },
    { name: 'Vehicles',                      description: 'Interior deep cleaning that lifts stains from seats, floors, and roofs, leaving your car spotless.',                            price: 650 },
    { name: 'Rug Rejuvenation',              description: 'Specialised treatment to revive delicate rugs, restoring their original vibrant patterns and texture.',                         price: 250 },
    { name: 'High Pressure (Outdoor)',       description: 'Powerful cleaning for roofs, windows, paving, and exterior walls to remove mould and grime.',                                  price: 850 },
    { name: 'Upholstery Cleaning (Couches and Chairs)', description: 'Deep fabric cleaning that removes odours and stains, giving new life to your lounge and dining sets.',                         price: 550 },
    { name: 'Curtains',                      description: 'Gentle yet effective cleaning that removes dust and pollutants without harming the fabric.',                                    price: 150 },
  ];

  for (const s of deepCleaningServices) {
    await prisma.service.create({ data: { ...s, storeId: deepCleaning.id } });
  }

  // ─── 2. PRESSURE CLEANING ───────────────────────────────────────────────────
  const pressureCleaning = await prisma.store.create({
    data: {
      slug: 'pressure-cleaning',
      name: 'High Pressure Cleaning',
      themeColor: '#14b8a6',
      contactPhone: '072 359 1276',
      contactEmail: 'underpressure786@gmail.com',
      pageTitle: 'Professional High Pressure Cleaning | TotalLŸ',
      pageDescription: 'Industrial-grade pressure washing for driveways, roofs, and exterior surfaces. Safe, eco-friendly cleaning across Cape Town.',
      tagline: 'Industrial Grade Solutions',
      heroHeadline: 'TotalLŸ High Pressure Cleaning',
      missionText: 'Restoring the exterior of your property with industrial-grade high-pressure solutions. We remove years of grime, moss, and weather damage efficiently and safely.',
      servicesHeadline: 'Restore Your Curb Appeal',
      servicesDescription: 'Complete exterior cleaning solutions to restore your property\'s beauty and protect its surfaces.',
      aboutHeading: 'Our Journey & Core Values',
      aboutUsText: 'Under Pressure is a Cape Town–based residential and commercial pressure washing service. We pride ourselves on delivering thorough, safe, and eco-friendly cleaning for every exterior surface. Cape Town and surrounding areas.',
      testimonialText: 'The pressure cleaning results were beyond my expectations. Years of grime disappeared in just a few hours. Truly professional work.',
      testimonialAuthor: 'James C.',
      testimonialAuthorRole: 'Homeowner, Cape Town',
      galleryImages: [
        { url: '/images/pressure-cleaning/services-flyer.jpg',        caption: 'Our Services' },
        { url: '/images/pressure-cleaning/driveway-before-after.jpg', caption: 'Driveway — Before & After' },
        { url: '/images/pressure-cleaning/roof-before-after.jpg',     caption: 'Roof Cleaning — Before & After' },
      ],
    },
  });

  const pressureCleaningServices = [
    { name: 'House Washing',        description: 'Complete exterior house washing to remove dirt, mould, and grime from all surfaces.',                                        price: null },
    { name: 'Roof Cleaning',        description: 'Safe eradication of moss and algae to prolong roof life and enhance curb appeal without damage.',                            price: null },
    { name: 'Gutter Cleaning',      description: 'Clearing blockages and washing exterior gutters to ensure proper drainage and a clean finish.',                               price: null },
    { name: 'Driveway Cleaning',    description: "Removing oil stains, weed buildup, and embedded dirt to restore the beauty of your property's entrance.",                    price: null },
    { name: 'Paver Cleaning',       description: 'High-pressure treatment for all paving surfaces, restoring their original colour and texture.',                               price: null },
    { name: 'Sidewalk Cleaning',    description: 'Blasting away embedded dirt and stains from sidewalks and pedestrian areas.',                                                 price: null },
    { name: 'Pool Cage & Deck',     description: 'Specialised cleaning for pool surrounds and decks, removing algae and stains.',                                               price: null },
    { name: 'Fence Cleaning',       description: 'High-pressure cleaning for all fence types, removing rust, mould, and buildup.',                                              price: null },
    { name: 'Window Cleaning',      description: 'Professional window cleaning for a streak-free, crystal-clear finish.',                                                        price: null },
    { name: 'Exterior Walls',       description: 'Restoring brickwork and plastered walls to their original colour by lifting years of grime and pollution.',                   price: null },
  ];

  for (const s of pressureCleaningServices) {
    await prisma.service.create({ data: { ...s, storeId: pressureCleaning.id } });
  }

  // ─── 3. GIFTING ─────────────────────────────────────────────────────────────
  const gifting = await prisma.store.create({
    data: {
      slug: 'gifting',
      name: 'PersonaLŸised Gifting',
      themeColor: '#f43f5e',
      contactPhone: '0718789141',
      contactEmail: 'info@totally.co.za',
      pageTitle: 'Personalised Gift Studio | TotalLŸ Gifting',
      pageDescription: 'Bespoke handcrafted gifts with Arabic calligraphy. Personalised Musallahs, Madrassa Bags, and custom gift sets.',
      tagline: 'Bespoke Craftsmanship',
      heroHeadline: 'PersonaLŸised Gifting Studio',
      missionText: 'Bespoke craftsmanship for your brand and home. From personalised Musallahs to custom Madrassa Bags — each piece is handcrafted with Arabic calligraphy unique to the recipient.',
      servicesHeadline: 'Our Creative Categories',
      servicesDescription: 'Handcrafted bespoke gifts that celebrate your story and values with premium quality and personal touches.',
      aboutHeading: 'Crafted with Purpose.',
      aboutUsText: "TotalLŸ Gifting Studio was founded by young South African entrepreneurs with a vision to merge local craftsmanship with global excellence.\n\nMentored by an Islamic school leader, our core principles of Honesty, Fairness, and Trust are woven into every bag, mat, and gift set we produce. We don't just make products — we help you tell your story.",
      testimonialText: 'The quality of the personalised bags and musallahs is outstanding. Each one is truly unique and made with such care.',
      testimonialAuthor: 'Fawza Essa',
      testimonialAuthorRole: 'Verified Studio Client',
      deliveryNote: 'Free delivery within the Panorama & Plattekloof area',
      galleryImages: [
        { url: '/images/gifting/collage-1.jpg',                caption: 'Bags & Musallahs Collection' },
        { url: '/images/gifting/musallahs-teal-grey-pink.jpg', caption: 'Musallahs — Teal, Grey & Pink' },
        { url: '/images/gifting/musallahs-grey-close.jpg',     caption: 'Grey Musallahs — Gold Calligraphy' },
        { url: '/images/gifting/musallahs-pink-teal.jpg',      caption: 'Pink & Teal Musallahs' },
        { url: '/images/gifting/bags-black-maroon.jpg',        caption: 'Madrassa Bags — Black & Maroon' },
        { url: '/images/gifting/musallahs-grey-pair.jpg',      caption: 'Grey Musallahs Pair' },
        { url: '/images/gifting/musallahs-teal-detail.jpg',    caption: 'Teal Musallah Close-Up' },
        { url: '/images/gifting/musallahs-folded-stack.jpg',   caption: 'Folded Musallahs Stack' },
      ],
    },
  });

  const giftingProducts = [
    { name: 'Madrassa Bags',      description: 'Personalised velvet bag with stunning gold Arabic calligraphy. Available in multiple colours including black, maroon, and navy.', price: 290 },
    { name: 'Musallahs – Adult',  description: 'Personalised adult salaat mat with gold calligraphy and gold fringe trim. Premium velvet finish in your choice of colour.',       price: 250 },
    { name: 'Musallahs – Kids',   description: 'Personalised kids salaat mat — same premium quality in a smaller size, perfect for little ones.',                                 price: 180 },
  ];

  for (const p of giftingProducts) {
    await prisma.product.create({ data: { ...p, storeId: gifting.id } });
  }

  // ─── 4. SAMPLE LEADS ────────────────────────────────────────────────────────
  await prisma.lead.createMany({
    data: [
      { storeId: deepCleaning.id,    customerName: 'Ameera Khan',   customerEmail: 'ameera@example.com', customerPhone: '082 111 2233', location: 'CBD',              status: 'NEW',    requestedDate: new Date('2026-04-25') },
      { storeId: deepCleaning.id,    customerName: 'Yusuf Isaacs',  customerEmail: 'yusuf@example.com',  customerPhone: '083 444 5566', location: 'Bellville',        status: 'QUOTED', requestedDate: new Date('2026-04-27') },
      { storeId: pressureCleaning.id,customerName: 'Sarah Smith',   customerEmail: 'sarah@example.com',  customerPhone: '084 777 8899', location: 'Northern Suburbs', status: 'NEW',    requestedDate: new Date('2026-04-30') },
    ],
  });

  console.log('✅ Seed complete — 3 stores, all services, all products, sample leads.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
