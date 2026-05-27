import { NextResponse } from 'next/server';
import { getChampionSynergy, getChampionMultiSynergy } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '20');
    const size = parseInt(searchParams.get('size') || '2');

    let data;
    if (size === 2) {
      data = await getChampionSynergy(league, limit);
    } else {
      data = await getChampionMultiSynergy(league, limit, size);
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Champion synergy error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
