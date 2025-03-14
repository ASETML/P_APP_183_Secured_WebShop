const db = require("../database/database");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  get: (req, res) => {
    const token = req.cookies.token;
    try {
      //On vérifie le token
      const decodedToken = jsonwebtoken.verify(token, process.env.SECRETKEY);
      //L'id de l'utilisateur est le même que la page à laquelle il veut accéder
      if (decodedToken.id == req.params.id) {
        //On affiche la page de compte
        res.render("user", {
          accountName: decodedToken.username,
          id: decodedToken.id,
          admin: decodedToken.admin,
        });
      } else {
        //Il n'a pas le droit
        res.render("user", {
          accountName: "Forbidden",
          id: "403",
          admin: "",
        });
      }
    } catch (error) {
      //On revient sur la page de login en cas de problème
      return res.render("login", { accountName: "" });
    }
  },
};
