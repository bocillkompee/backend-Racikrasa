
const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrder,
    getOrderDetail,
    updateOrderStatus,
    getAllOrders,
} = require("../controllers/orderController");

const { verifyToken } = require("../middleware/authMiddleware");
const { verifyRole } = require("../middleware/roleMiddleware");

// Membuat pesanan customer
router.post(
    "/",
    verifyToken,
    verifyRole("customer"),
    createOrder
);

// Mengambil riwayat pesanan customer
router.get(
    "/my-orders",
    verifyToken,
    verifyRole("customer"),
    getMyOrder
);

// Mengambil detail pesanan customer
router.get(
    "/:id",
    verifyToken,
    verifyRole("customer"),
    getOrderDetail
);

// Mengubah status pesanan khusus admin dan kasir
router.put(
    "/:id/status",
    verifyToken,
    verifyRole("admin", "cashier"),
    updateOrderStatus
);

//mengambil semua pesanan khusus admin dan kasir
router.get(
    "/",
    verifyToken,
    verifyRole("admin", "cashier"),
    getAllOrders
);

module.exports = router;
