const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController");

router.get("/login", (req, res) => {
  res.render("login", { accountName: "Alban" });
});

router.post("/login", controller.login);

router.get("/register", (req, res) => {
  res.render("register", { accountName: "Alban" });
});

router.post("/register", controller.register);

module.exports = router;
