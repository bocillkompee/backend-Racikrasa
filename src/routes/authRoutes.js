
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { verifyRole } = require("../middleware/roleMiddleware");


// Route Register
router.post("/register", registerUser);

// Route Login
router.post("/login", loginUser);

// Route khusus Customer
router.get(
  "/customer",
  verifyToken,
  verifyRole("customer"),
  (req, res) => {
    res.status(200).json({
      message: "Selamat datang Customer RacikRasa",
      user: req.user,
    });
  }
);

//route khusus admin
router.get(
  "/admin",
  verifyToken,
  verifyRole("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Selamat datan admin Racikrasa",
            user: req.user,
        });
    }

);
module.exports = router;
