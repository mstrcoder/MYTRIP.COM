const express = require("express");
const views= require("./controllers/views");
const router = express.Router();
const Auth= require("./controllers/auth");
// router.use(Auth.isLogeedIn);
router.get("/", Auth.isLogeedIn,views.getOverview);
router.get("/tour/:id", Auth.isLogeedIn,views.getTour);
router.get("/login",Auth.isLogeedIn, views.login);
router.get("/me", Auth.protect,views.getAccount);
router.post('/submit-user-data',Auth.protect,views.updateUserData)
module.exports = router;
