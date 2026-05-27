import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const year = searchParams.get('year') || undefined;
    const patch = searchParams.get('patch') || undefined;
    const playoffsParam = searchParams.get('playoffs');
    const playoffs = playoffsParam === 'true' ? true : undefined;

    const data = await getMatches(league, limit, year, patch, playoffs);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Matches error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
