const crypto = require("crypto");
const db = require("../database/database");
const jsonwebtoken = require("jsonwebtoken");
const escapeHTML = require("escape-html");

module.exports = {
  //Inscription
  register: (req, res) => {
    //Récupération des credentials
    const password = escapeHTML(req.body.password);
    const confirmPassword = escapeHTML(req.body.confirmPassword);
    const username = escapeHTML(req.body.username);

    if (password === confirmPassword) {
      //Génération du sel
      const salt = crypto.randomBytes(8).toString("hex");

      //Hachage du mot de passe
      const hash = crypto.hash("sha256", password + salt + process.env.PEPPER);

      //Insertion de l'utilisateur dans la DB
      db.connect();
      db.query(
        "INSERT INTO t_users (username, password, salt, admin) VALUES (?, ?, ?, ?)",
        [username, hash, salt, false],
        function (error) {
          return res.redirect("/login");
        }
      );
    }
  },

  //Connexion
  login: (req, res) => {
    //Récupération des credentials
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

        //Si il y a un utilisateur avec le nom dans la DB
        if (results.length > 0) {
          salt = results[0].salt;
          passwordHash = results[0].password;

          //Hash des credentials
          const toCheck = crypto.hash(
            "sha256",
            password + salt + process.env.PEPPER
          );

          //Vérification des credentials
          if (toCheck == passwordHash) {
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
            //On met la token dans les cookies et on redirige l'utilisateur vers son profil
            res.cookie("token", token, { httpOnly: true });
            res.redirect("user/" + results[0].users_id);
          } else {
            res.render("login", { accountName: "" });
            //res.status(401).json({ error: "Invalid username or password" });
          }
        } else {
          res.render("login", { accountName: "" });
        }
      }
    );
  },

  logout: (req, res) => {
    //Supression du token
    res.clearCookie("token");
    res.redirect("/login");
  },
};
