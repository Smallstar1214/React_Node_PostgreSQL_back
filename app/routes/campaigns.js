const express = require("express");
const router = express.Router();

const { getCampaigns, getCampaignById, createCampaign, updateCampaign, updateCampaignPortfolio} = require("../controllers/campaign");

router.route("/").get(getCampaigns);
router.route("/:id").get(getCampaignById);
router.route("/").post(createCampaign);
router.route("/:id").put(updateCampaign);
router.route("/screen/:id").put(updateCampaignPortfolio);

module.exports = router;