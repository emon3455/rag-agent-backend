const express = require("express");
const router = express.Router();
const { register, login, getAllUser } = require("../controllers/authController");

// all user
router.get("/", getAllUser);

// registration
router.post("/register", register);

// login
router.post("/login", login);


module.exports = router;
