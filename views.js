const express = require("express");
const views= require("./controllers/views");
const router = express.Router();
const Auth= require("./controllers/auth");
router.use(Auth.isLogeedIn);
router.get("/", views.getOverview);
router.get("/tour/:id", views.getTour);
router.get("/login", views.login);
module.exports = router;
