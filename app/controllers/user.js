const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const Helper = require('./Helper');

const getUsers = (req, res) => {
  const searchKey = req.query.searchKey;
  var query = "SELECT * FROM users WHERE firstname like  '%" + searchKey + "%' or lastname like '%" + searchKey + "%' ORDER BY id DESC";
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json(results.rows)
  })
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json(results.rows[0])
  })
}

const createUser = (req, res) => {
  const hashPassword = Helper.hashPassword(req.body.password);
  const values = [
    req.body.avatar,
    req.body.firstname,
    req.body.lastname,
    hashPassword,
    req.body.email,
    req.body.department,
    req.body.role
  ];

  const query = "INSERT INTO users (avatar, firstname, lastname, password, email, department, role, lastlogindate) " +
    " VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *";

  pool.query(query, values).then(result => {
    return res.status(200).json({ message: `Successfully added a user` });
  }).catch(err => {
    console.error('Error executing query', err.stack);
  })

}

const updateUser = (req, res) => {
  pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]).then((results) => {
    const user = results.rows[0];
    const values = [];
    if (user?.password === req.body.password) {
      values.push(req.body.avatar,
        req.body.firstname,
        req.body.lastname,
        req.body.password,
        req.body.email,
        req.body.department,
        req.body.role,
        req.params.id);
    } else {
      const hashPassword = Helper.hashPassword(req.body.password);
      values.push(req.body.avatar,
        req.body.firstname,
        req.body.lastname,
        hashPassword,
        req.body.email,
        req.body.department,
        req.body.role,
        req.params.id);
    }
    var query = 'UPDATE users SET avatar=$1, firstname=$2, lastname=$3, password=$4, email=$5, department=$6, role=$7, lastlogindate=NOW() WHERE id=$8';
    pool.query(query, values)
      .then(result => {
        return res.status(200).json({ message: `Successfully updated a User` });
      })
      .catch(err => {
        console.error('Error executing query', err.stack);
      });
  }).catch(err => {
    console.log(err)
    return res.status(400).json({ message: "User not found" });
  })
}

const deleteUser = (req, res) => {
  var id = req.params.id;
  pool.query(`DELETE FROM users WHERE id = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json({ message: "Successfully deleted a User" });
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}