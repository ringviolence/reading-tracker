import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'testpass123';

async function main() {
  console.log('Seeding database...');

  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });

  if (existingUser) {
    console.log('Test user already exists. Deleting existing data...');
    await prisma.badgeAward.deleteMany({ where: { userId: existingUser.id } });
    await prisma.seasonProgress.deleteMany({ where: { userId: existingUser.id } });
    await prisma.readingSession.deleteMany({ where: { userId: existingUser.id } });
    await prisma.book.deleteMany({ where: { userId: existingUser.id } });
    await prisma.session.deleteMany({ where: { userId: existingUser.id } });
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  // Create test user
  const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 12);
  const testUser = await prisma.user.create({
    data: {
      email: TEST_USER_EMAIL,
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log(`Created test user: ${testUser.email}`);

  // Create some books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        userId: testUser.id,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'LITERARY_FICTION',
        totalPages: 180,
        currentPage: 180,
        status: 'COMPLETED',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    }),
    prisma.book.create({
      data: {
        userId: testUser.id,
        title: '1984',
        author: 'George Orwell',
        genre: 'SCIENCE_FICTION',
        totalPages: 328,
        currentPage: 328,
        status: 'COMPLETED',
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    }),
    prisma.book.create({
      data: {
        userId: testUser.id,
        title: 'Sapiens',
        subtitle: 'A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        genre: 'HISTORY',
        totalPages: 443,
        currentPage: 150,
        status: 'READING',
      },
    }),
    prisma.book.create({
      data: {
        userId: testUser.id,
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'SELF_HELP',
        totalPages: 320,
        currentPage: 80,
        status: 'READING',
      },
    }),
  ]);

  console.log(`Created ${books.length} books`);

  // Create reading sessions (spread over past 7 days for streak)
  const sessions = [];
  const now = new Date();

  // Day 1 (today) - read Sapiens
  sessions.push({
    userId: testUser.id,
    bookId: books[2].id,
    date: new Date(now),
    startPage: 120,
    endPage: 150,
    pagesRead: 30,
  });

  // Day 2 (yesterday) - read Atomic Habits
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  sessions.push({
    userId: testUser.id,
    bookId: books[3].id,
    date: yesterday,
    startPage: 50,
    endPage: 80,
    pagesRead: 30,
  });

  // Day 3 - finished 1984
  const day3 = new Date(now);
  day3.setDate(day3.getDate() - 2);
  sessions.push({
    userId: testUser.id,
    bookId: books[1].id,
    date: day3,
    startPage: 280,
    endPage: 328,
    pagesRead: 48,
  });

  // Day 4 - read 1984
  const day4 = new Date(now);
  day4.setDate(day4.getDate() - 3);
  sessions.push({
    userId: testUser.id,
    bookId: books[1].id,
    date: day4,
    startPage: 200,
    endPage: 280,
    pagesRead: 80,
  });

  // Day 5 - read 1984
  const day5 = new Date(now);
  day5.setDate(day5.getDate() - 4);
  sessions.push({
    userId: testUser.id,
    bookId: books[1].id,
    date: day5,
    startPage: 100,
    endPage: 200,
    pagesRead: 100,
  });

  // Day 6 - finished Great Gatsby
  const day6 = new Date(now);
  day6.setDate(day6.getDate() - 5);
  sessions.push({
    userId: testUser.id,
    bookId: books[0].id,
    date: day6,
    startPage: 140,
    endPage: 180,
    pagesRead: 40,
  });

  // Day 7 - read Great Gatsby
  const day7 = new Date(now);
  day7.setDate(day7.getDate() - 6);
  sessions.push({
    userId: testUser.id,
    bookId: books[0].id,
    date: day7,
    startPage: 0,
    endPage: 140,
    pagesRead: 140,
  });

  await prisma.readingSession.createMany({ data: sessions });
  console.log(`Created ${sessions.length} reading sessions`);

  // Compute badges and XP for the current season
  const { getSeasonForDate } = await import('../src/lib/seasons');
  const { refreshSeasonProgress } = await import('../src/lib/badges');
  const seasonInfo = getSeasonForDate(new Date());
  const season = await prisma.season.upsert({
    where: { year_name: { year: seasonInfo.year, name: seasonInfo.name } },
    create: { year: seasonInfo.year, name: seasonInfo.name, startDate: seasonInfo.startDate, endDate: seasonInfo.endDate },
    update: {},
  });
  const { newBadges } = await refreshSeasonProgress(testUser.id, season);
  console.log(`Awarded ${newBadges.length} badges via season progress`);

  console.log('\n✅ Seed completed!');
  console.log(`\nTest user credentials:`);
  console.log(`  Email: ${TEST_USER_EMAIL}`);
  console.log(`  Password: ${TEST_USER_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
