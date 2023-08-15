const { Pool } = require('pg');

// create a PostgreSQL pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// export the pool object
module.exports = pool;