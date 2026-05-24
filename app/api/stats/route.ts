import { NextResponse } from 'next/server';
import { getDatabaseStats, getLeagues } from '@/lib/db-queries';

export async function GET() {
  try {
    const [stats, leagues] = await Promise.all([
      getDatabaseStats(),
      getLeagues()
    ]);
    
    return NextResponse.json({ 
      success: true, 
      stats,
      leagues
    });
  } catch (error: any) {
    console.error('[API] Stats error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
