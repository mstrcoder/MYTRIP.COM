const express = require("express");
const views= require("./controllers/views");
const router = express.Router();

router.get("/", views.getOverview);
router.get("/tour/:id", views.getTour);
router.get("/login", views.login);
module.exports = router;
