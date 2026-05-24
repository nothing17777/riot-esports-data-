import { NextResponse } from 'next/server';
import { getProPlayers } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');

    const data = await getProPlayers(league, limit);
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Players error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
