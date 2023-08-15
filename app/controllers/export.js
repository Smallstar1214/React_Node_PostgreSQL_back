const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const getExportById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT brand, campaign, lastmodified, planned, delivered, remain, clicked, ctr, viewability, sequare, fivezero, sevenfive, hundred FROM campaigns WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json(results.rows);
  })
}

module.exports = {
  getExportById
}