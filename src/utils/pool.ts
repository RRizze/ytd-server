import dotenv from 'dotenv';
dotenv.config();

import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.HOST_NAME || 'localhost',
  user: process.env.DB_USER || 'ytd',
  password: process.env.DB_PASS || 'ytd',
  database: process.env.DB_NAME || 'youtd',
  sessionVariables: {
    wait_timeout: 31536000,
  },
  acquireTimeout: 5000,
  connectionLimit: 8,
});

export default pool;
