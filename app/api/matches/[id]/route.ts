import { NextResponse } from 'next/server';
import { getMatchDetailFromDb } from '@/lib/db-queries';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getMatchDetailFromDb(id);

    if (!data) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API] Match detail error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
