const crypto = require("crypto");
const db = require("../database/database");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
router.get("/", controller.get);

router.get("/login", (req, res) => {
  res.render("login", { accountName: "Alban" });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  res.redirect("/user");
  //TODO déplacer dans /user
  res.render("user", { accountName: req.body.username });
});

router.get("/register", (req, res) => {
  res.render("register", { accountName: "Alban" });
});

router.post("/register", (req, res) => {
  console.log(req.body);

  if (req.body.password == req.body.confirmPassword) {
    //Génération du sel
    const salt = crypto.randomBytes(8).toString("hex");
    console.log("salt: " + salt);

    //Hachage du mot de passe
    const hash = crypto.hash("sha256", req.body.password + salt);
    console.log("hash: " + hash);

    db.connect();

    db.query(
      "INSERT INTO t_users (username, password, salt) VALUES (?, ?, ?)",
      [req.body.username, hash, salt],
      function (error, results, fields) {
        if (error) throw error;
        console.log("The solution is: ", results);
      }
    );

    db.end();
  }
  res.render("user", { accountName: req.body.username });
});

module.exports = router;
