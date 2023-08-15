const express = require("express");
const router = express.Router();

const {addReport, getReportById} = require("../controllers/report");

router.route("/:id").put(addReport);
router.route("/:id").get(getReportById);

module.exports = router;