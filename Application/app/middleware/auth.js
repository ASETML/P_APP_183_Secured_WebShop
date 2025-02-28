const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const auth = function (req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      console.log(token);
      const decodedToken = jsonwebtoken.verify(token, process.env.SECRETKEY);
      next();
    } catch (error) {
      console.log(error);
      //return res.status(401).json({ error: "Le token n'est pas valide" });
      return res.render("login", { accountName: "" });
    }
  } else {
    //return res.status(400).json({ error: "Vous devez fournir un token" });
    return res.render("login", { accountName: "" });
  }
};

module.exports = auth;
