const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");
const auth = require("../middleware/auth");

router.get("/:id", auth, controller.get);

module.exports = router;
