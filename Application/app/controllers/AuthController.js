const crypto = require("crypto");
const db = require("../database/database");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  register: (req, res) => {
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
  },

  login: (req, res) => {
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

        if (results.length > 0) {
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
        } else {
          res.render("login", { accountName: "" });
        }
      }
    );
  },
};
