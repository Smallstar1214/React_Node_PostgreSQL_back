const Helper = require('./Helper');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

/**
 * Register A User
 * @param {object} req 
 * @param {object} res
 * @returns {object} reflection object 
 */
const register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ 'message': 'Some values are missing' });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const hashPassword = Helper.hashPassword(req.body.password);

  try {
    const checkEmailQuery = "SELECT * FROM users WHERE email=$1";
    pool.query(checkEmailQuery, [req.body.email]).then(checkResult => {
      if (checkResult.rows[0]) {
        return res.status(400).send({ message: 'Duplicated email address' });
      } else {
        const createQuery = "INSERT INTO users (avatar, firstname, lastname, password, email, department, role, lastlogindate) " +
          " VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *";
        const values = [
          req.body.avatar,
          req.body.firstname,
          req.body.lastname,
          hashPassword,
          req.body.email,
          req.body.department,
          req.body.role
        ];

        try {
          pool.query(createQuery, values).then((results) => {
            const user = results.rows[0];
            const token = Helper.generateToken(user.id);
            return res.status(200).send({ message: "Register User Successfully", user: user, token: token });
          })
        } catch (error) {
          if (error.routine === '_bt_check_unique') {
            return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
          }
          return res.status(400).send(error);
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}
/**
 * Login
 * @param {object} req 
 * @param {object} res
 * @returns {object} user object 
 */
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ 'message': 'Some values are missing' });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    pool.query(query, [req.body.email]).then((results) => {
      const user = results.rows[0];
      if (!user) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
      if (!Helper.comparePassword(user.password, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
      const token = Helper.generateToken(user.id);
      return res.status(200).send({ message: "Login User Successfully", user: user, token: token });
    })
  } catch (error) {
    return res.status(400).send(error)
  }
}

module.exports = {
  register,
  login
}
