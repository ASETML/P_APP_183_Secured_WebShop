const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const auth = function (req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, process.env.SECRETKEY);
      //Si on arrive la, c'est que le token est valide
      next();
    } catch (error) {
      //Le token n'est pas valide, on revient à la page de login
      return res.render("login", { accountName: "" });
    }
  } else {
    //return res.status(400).json({ error: "Vous devez fournir un token" });
    return res.render("login", { accountName: "" });
  }
};

module.exports = auth;
