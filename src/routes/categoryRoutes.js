const express = require("express");
const router = express.Router();

const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyRole } = require("../middleware/roleMiddleware");
const { verify } = require("jsonwebtoken");

// Menambahkan kategori khusus Admin
router.post(
  "/",
  verifyToken,
  verifyRole("admin"),
  createCategory
);

//menambah kategori khusus admin
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

router.delete(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  deleteCategory
)

module.exports = router;