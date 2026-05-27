import { NextResponse } from 'next/server';
import { getLaneMatchups } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'mid';
    const league = searchParams.get('league') || 'ALL';
    const limit = parseInt(searchParams.get('limit') || '100');

    const data = await getLaneMatchups(role, league, limit);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Lane matchups error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
