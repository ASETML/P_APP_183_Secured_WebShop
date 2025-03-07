const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController");

router.get("/login", (req, res) => {
  res.render("login", { accountName: "" });
});

router.post("/login", controller.login);

router.get("/register", (req, res) => {
  res.render("register", { accountName: "" });
});

router.post("/register", controller.register);

router.get("/logout", controller.logout);

module.exports = router;
