import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the connection by running a simple query
    const result = await db.execute('SELECT 1 as test');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      result: result.rows,
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
