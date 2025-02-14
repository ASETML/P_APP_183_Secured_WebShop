const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(express.json());
//Middleware qui rempli req.body
app.use(express.urlencoded());

//Middleware pour les cookies
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const userRoute = require("./routes/User");
app.use("/user", userRoute);

const authRoute = require("./routes/Auth");

app.use("/", authRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
