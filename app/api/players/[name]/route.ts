import { NextResponse } from 'next/server';
import { getPlayerDetails } from '@/lib/db-queries';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);
    const data = await getPlayerDetails(decodedName);

    if (!data) {
      return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, {
      headers: {
        // Cache for 5 minutes on browser, 10 minutes on CDN/edge
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      }
    });
  } catch (error: any) {
    console.error('[API] Player detail error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
