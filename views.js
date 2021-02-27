const express = require("express");
const views= require("./controllers/views");
const router = express.Router();

router.get("/", views.getOverview);
router.get("/tour/:id", views.getTour);
module.exports = router;
