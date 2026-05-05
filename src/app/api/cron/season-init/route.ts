import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSeason } from '@/lib/seasons';
import { refreshSeasonProgress } from '@/lib/badges';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const seasonInfo = getCurrentSeason();

  let season = await prisma.season.findUnique({
    where: { year_name: { year: seasonInfo.year, name: seasonInfo.name } },
  });

  if (!season) {
    season = await prisma.season.create({
      data: {
        year: seasonInfo.year,
        name: seasonInfo.name,
        startDate: seasonInfo.startDate,
        endDate: seasonInfo.endDate,
      },
    });
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  for (const user of users) {
    await refreshSeasonProgress(user.id, season);
  }

  return NextResponse.json({
    ok: true,
    season: seasonInfo.label,
    users: users.length,
  });
}
