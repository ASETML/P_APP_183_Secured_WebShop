const express = require("express");

const app = express();

app.use(express.json());
//Middleware qui rempli req.body
app.use(express.urlencoded());

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const userRoute = require("./routes/User");

app.use("/user", userRoute);

// Démarrage du serveur
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
