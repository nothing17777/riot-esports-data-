import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the connection by running a simple query
    const result = await db.execute('SELECT datetime("now") as server_time');
    
    // Get list of tables in the database
    const tablesResult = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    
    const tables = tablesResult.rows.map((row) => row.name as string);
    const serverTime = result.rows[0]?.server_time as string;

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      timestamp: serverTime,
      tables: tables,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
