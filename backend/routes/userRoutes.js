const express = require("express");
const {
  getProfile,
  updateProfile,
  getUsers
} = require("../controllers/userController");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/", getUsers);

module.exports = router;