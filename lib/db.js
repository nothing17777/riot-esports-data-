// lib/db.js
import { createClient } from '@libsql/client';

let _db = null;

export const db = {
  execute: async (sql, args) => {
    if (!_db) {
      const url = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!url) {
        throw new Error('TURSO_DATABASE_URL environment variable is not set');
      }
      
      _db = createClient({
        url,
        authToken,
      });
    }
    
    // Handle both object-style { sql, args } and string-style calls
    if (typeof sql === 'string') {
      return _db.execute(sql, args);
    }
    return _db.execute(sql);
  }
};