const pool = require('../utils/db.js');

const getCampaigns = (req, res) => {
  const searchKey = req.query.searchKey;
  const megaMenu = req.query.megaMenu;
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);
  var where = "WHERE (brand like '%" + searchKey + "%' or campaign like '%" + searchKey + "%')";
  if (megaMenu !== "undefined" && megaMenu != "") {
    where += " and status = '" + megaMenu + "'";
  }
  // var query = "SELECT * FROM campaigns " + where + " ORDER BY lastmodified DESC LIMIT " + page + " OFFSET " + pageSize;
  var query = "SELECT * FROM campaigns " + where + " ORDER BY lastmodified DESC";
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json(results.rows);
  })
}

const getCampaignById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM campaigns WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    return res.status(200).json(results.rows)
  })
}

const createCampaign = (req, res) => {

  const values = [
    req.body.brand,
    req.body.campaign,
    req.body.source,
    req.body.completion,
    req.body.type,
    req.body.planned,
    req.body.delivered,
    req.body.required,
    req.body.difference,
    req.body.remain,
    req.body.start,
    req.body.finish,
    req.body.status,
    req.body.responsible,
    req.body.notes
  ];

  const query = "INSERT INTO campaigns (brand, campaign, source, completion, type, planned, delivered, required, difference, remain, start, finish, status, responsible, lastModified, notes) " +
    " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), $15) RETURNING *";

  pool.query(query, values).then(result => {
    return res.status(200).json({ message: `Successfully added a campaign` });
  }).catch(err => {
    console.error('Error executing query', err.stack);
  })

}


const updateCampaign = (req, res) => {
  const values = [
    req.body.brand,
    req.body.notes,
    req.params.id
  ];

  var query = 'UPDATE campaigns SET brand=$1, campaign=$2, source=$3, completion=$4, type=$5, planned=$6, delivered=$7, required=$8, difference=$9, remain=$10, start=$11, finish=$12, status=$13, responsible=$14, lastmodified=NOW(), notes=$15 WHERE id=$16';
  pool.query(query, values)
    .then(result => {
      return res.status(200).json({ message: `Successfully updated a campaign` });
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
    });
}

const updateCampaignPortfolio = (req, res) => {
  // const filepath = 
  console.log(req);
  const values = [
    req.body.upload,
    req.params.id
  ];
  

  var query = 'UPDATE campaigns SET image = $1 WHERE id=$2';
  pool.query(query, values)
    .then(result => {
      return res.status(200).json({ message: req.body.image });
    })
    .catch(err => {
      console.error('Error executing query', err.stack);
    });
}

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  updateCampaignPortfolio
}