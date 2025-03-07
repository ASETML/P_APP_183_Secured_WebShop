const db = require("../database/database");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  get: (req, res) => {
    db.connect();
    db.query(
      "SELECT username FROM t_users WHERE users_id = ?",
      [req.params.id],
      function (error, results, fields) {
        //res.render("admin", { accountName: "Admin", userList: results });
        if (error) throw error;
        if (results.length > 0) {
          const token = req.cookies.token;
          try {
            const decodedToken = jsonwebtoken.verify(
              token,
              process.env.SECRETKEY
            );
            if (decodedToken.id == req.params.id) {
              res.render("user", {
                accountName: results[0].username,
                id: req.params.id,
              });
            } else {
              res.render("user", {
                accountName: "Forbidden",
                id: "403",
              });
            }
          } catch (error) {
            console.log(error);
            //return res.status(401).json({ error: "Le token n'est pas valide" });
            return res.render("login", { accountName: "" });
          }
        } else {
          res.status(401).json({ error: "Invalid username or password" });
        }
      }
    );
  },
};
