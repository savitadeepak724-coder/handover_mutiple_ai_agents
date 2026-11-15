const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool using the DATABASE_URL from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/handover_db',
});

pool.on('connect', () => {
  console.log('[db] Connected to PostgreSQL database successfully.');
});

pool.on('error', (err) => {
  console.error('[db-error] Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};