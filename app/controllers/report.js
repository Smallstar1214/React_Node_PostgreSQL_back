const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const addReport = (req, res) => {

  const values = [
    req.body.delivered,
    req.body.clicked,
    req.body.viewability,
    req.body.sequare,
    req.body.fivezero,
    req.body.sevenfive,
    req.body.hundred,
    req.body.notes,
    req.params.id,
    req.body.ctr,
  ];

  var query = 'UPDATE campaigns SET delivered=$1, clicked=$2, viewability=$3, sequare=$4, fivezero=$5, sevenfive=$6, hundred=$7, notes=$8, lastmodified=NOW(), ctr=$10 WHERE id=$9';
  pool.query(query, values)
    .then(result => {
      return res.status(200).json({ message: `Successfully added a report` });
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
    });
}

const getReportById = (req, res) => {
  console.log(req.params.id);
  const id = parseInt(req.params.id)

  pool.query('SELECT delivered, clicked, viewability, sequare, fivezero, sevenfive, hundred, notes FROM campaigns WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json(results.rows);
  })
}

module.exports = {
  addReport,
  getReportById
}