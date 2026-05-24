import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tables = [
      'champion_presence',
      'champion_synergy',
      'champion_counters',
      'champion_win_rates',
      'matches',
      'participants',
      'pro_players',
      'bans'
    ];

    const schemas: Record<string, any> = {};
    const sampleData: Record<string, any> = {};

    for (const table of tables) {
      // Get table schema
      const schemaResult = await db.execute(`PRAGMA table_info(${table})`);
      schemas[table] = schemaResult.rows;

      // Get sample data (first 3 rows)
      const dataResult = await db.execute(`SELECT * FROM ${table} LIMIT 3`);
      sampleData[table] = dataResult.rows;
    }

    return NextResponse.json({ success: true, schemas, sampleData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
