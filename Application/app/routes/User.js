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
  // Get the client
  const mysql = require("mysql2");

  // Create the connection to database
  const connection = mysql.createConnection({
    host: "localhost",
    port: "6033",
    user: "root",
    password: "root",
    database: "mysql",
  });

  // Using placeholders
  connection.query("SELECT * FROM users", function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  });

  res.render("user", { accountName: req.body.username });
});

module.exports = router;
