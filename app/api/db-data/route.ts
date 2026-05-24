import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'champion_presence';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Whitelist allowed tables for security
    const allowedTables = [
      'champion_presence',
      'champion_synergy',
      'champion_counters',
      'champion_win_rates',
      'matches',
      'participants',
      'pro_players',
      'bans'
    ];

    if (!allowedTables.includes(table)) {
      return NextResponse.json({ success: false, error: 'Invalid table name' }, { status: 400 });
    }

    const result = await db.execute(`SELECT * FROM ${table} LIMIT ${limit}`);
    const countResult = await db.execute(`SELECT COUNT(*) as total FROM ${table}`);

    return NextResponse.json({
      success: true,
      table,
      total: countResult.rows[0]?.total || 0,
      rows: result.rows
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
