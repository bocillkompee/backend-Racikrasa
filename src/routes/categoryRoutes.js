const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  updateCategory,
} = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyRole } = require("../middleware/roleMiddleware");

// Menambahkan kategori khusus Admin
router.post(
  "/",
  verifyToken,
  verifyRole("admin"),
  createCategory
);

//menampilkan semua kategori 
router.get("/", getAllCategories)

// Mengubah kategori khusus Admin
router.put(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  updateCategory
);

module.exports = router;