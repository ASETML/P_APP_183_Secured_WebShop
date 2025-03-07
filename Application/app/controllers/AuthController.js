const crypto = require("crypto");
const db = require("../database/database");
const jsonwebtoken = require("jsonwebtoken");
const escapeHTML = require("escape-html");

module.exports = {
  //Inscription
  register: (req, res) => {
    const password = escapeHTML(req.body.password);
    const confirmPassword = escapeHTML(req.body.confirmPassword);
    const username = escapeHTML(req.body.username);

    if (password === confirmPassword) {
      //Génération du sel
      const salt = crypto.randomBytes(8).toString("hex");
      console.log("salt: " + salt);

      //Hachage du mot de passe
      const hash = crypto.hash("sha256", password + salt + process.env.PEPPER);
      console.log("hash: " + hash);

      db.connect();
      db.query(
        "INSERT INTO t_users (username, password, salt, admin) VALUES (?, ?, ?, ?)",
        [username, hash, salt, false],
        function (error) {
          console.log(error);
          try {
            if (error.code == "ER_DUP_ENTRY") {
              console.log("Le username existe déjà");
            }
          } catch (err) {}
          return res.redirect("/login");
        }
      );
    }
  },

  //Connexion
  login: (req, res) => {
    //Récupération des credentials
    console.log(req.body);
    const username = escapeHTML(req.body.username);
    const password = escapeHTML(req.body.password);
    let salt = "";
    let passwordHash = "";

    //Récupérations des hashs dans la DB
    db.connect();
    db.query(
      "SELECT users_id, password, salt, admin FROM t_users WHERE username = ?",
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
            console.log(results[0].admin);
            //Signature du token
            const token = jsonwebtoken.sign(
              {
                username: username,
                id: results[0].users_id,
                admin: results[0].admin,
              },
              process.env.SECRETKEY,
              {
                algorithm: "HS512",
                expiresIn: "1h",
              }
            );
            res.cookie("token", token, { expire: Date.now() + 3600 });
            res.redirect("user/" + results[0].users_id);
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
