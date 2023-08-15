const express = require("express");
const router = express.Router();

const {getExportById} = require("../controllers/export");

router.route("/:id").get(getExportById);

module.exports = router;