import { NextResponse } from 'next/server';
import { getChampionPresence } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'ALL';
    // Let's return more champions by default (e.g. 300) so we have the full champion roster
    const limit = parseInt(searchParams.get('limit') || '300');

    const data = await getChampionPresence(league, limit);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Champion presence error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
