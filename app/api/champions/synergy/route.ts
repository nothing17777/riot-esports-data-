import { NextResponse } from 'next/server';
import { getChampionSynergy } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '20');

    const data = await getChampionSynergy(league, limit);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Champion synergy error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
