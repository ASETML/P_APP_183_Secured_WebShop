const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const auth = function (req, res, next) {
  const token = req.body.token;
  if (token) {
    try {
      console.log(token);
      const decodedToken = jsonwebtoken.verify(token, process.env.SECRETKEY);
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Le token n'est pas valide" });
    }
  } else {
    return res.status(400).json({ error: "Vous devez fournir un token" });
  }
};

module.exports = auth;
