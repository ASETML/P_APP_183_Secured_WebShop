const express = require("express");
const router = express.Router();
const controller = require("../controllers/AdminController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.get);
router.post("/", auth, controller.search);

module.exports = router;
