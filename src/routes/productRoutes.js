const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyRole } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");


// Menambahkan produk (Admin)
router.post(
    "/",
    verifyToken,
    verifyRole("admin"),
    upload.single("image"),
    createProduct
);

// Menampilkan semua produk
router.get("/", getAllProducts);

// Mengubah produk (Admin)
router.put(
    "/:id",
    verifyToken,
    verifyRole("admin"),
    upload.single("image"),
    updateProduct
);

// Menghapus produk (Admin)
router.delete("/:id", verifyToken, verifyRole("admin"), deleteProduct);

module.exports = router;