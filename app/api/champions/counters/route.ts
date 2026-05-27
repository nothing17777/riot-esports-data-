import { NextResponse } from 'next/server';
import { getChampionCounters, getChampionMultiCounters } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '20');
    const size = parseInt(searchParams.get('size') || '1');
    const role1 = searchParams.get('role1') || 'Any';
    const role2 = searchParams.get('role2') || 'Any';

    let data;
    if (size === 1) {
      data = await getChampionCounters(league, limit);
    } else {
      data = await getChampionMultiCounters(league, limit, size, role1, role2);
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Champion counters error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
