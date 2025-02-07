const crypto = require("crypto");
const db = require("../database/database");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const jsonwebtoken = require("jsonwebtoken");

router.get("/", controller.get);

router.get("/login", (req, res) => {
  res.render("login", { accountName: "Alban" });
});

router.post("/login", async (req, res) => {
  //Récupération des credentials
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  let salt = "";
  let passwordHash = "";

  //Récupérations des hashs dans la DB
  db.connect();
  db.query(
    "SELECT password, salt FROM t_users WHERE username = ?",
    [username],
    function (error, results, fields) {
      if (error) throw error;
      salt = results[0].salt;
      console.log("salt : " + salt);
      passwordHash = results[0].password;
      console.log("password : " + passwordHash);

      //Hash des credentials
      const toCheck = crypto.hash(
        "sha256",
        password + salt + process.env.PEPPER
      );

      //Vérification des credentials
      if (toCheck == passwordHash) {
        //Signature du token
        const token = jsonwebtoken.sign(
          { username: username },
          process.env.SECRETKEY,
          {
            algorithm: "HS512",
            expiresIn: "1h",
          }
        );

        res.status(200).json({ token: token });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    }
  );

  //TODO déplacer dans /user
  //res.render("user", { accountName: req.body.username });
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
    const hash = crypto.hash(
      "sha256",
      req.body.password + salt + process.env.PEPPER
    );
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
  }
  res.render("user", { accountName: req.body.username });
});

module.exports = router;
