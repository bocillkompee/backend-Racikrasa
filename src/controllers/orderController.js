
const db = require("../config/database");

// Membuat pesanan baru
const createOrder = async (req, res) => {
    let connection;

    try {
        const { items } = req.body;
        const user_id = req.user.userId;

        // Validasi input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Pesanan harus memiliki minimal satu produk",
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        let total_price = 0;
        const orderItems = [];

        // Validasi produk dan menghitung subtotal
        for (const item of items) {
            const { product_id, quantity } = item;

            if (
                !Number.isInteger(product_id) ||
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error("ID produk atau jumlah produk tidak valid");
            }

            const [products] = await connection.execute(
                "SELECT id, price FROM products WHERE id = ?",
                [product_id]
            );

            if (products.length === 0) {
                throw new Error(`Produk dengan ID ${product_id} tidak ditemukan`);
            }

            const price = products[0].price;
            const subtotal = price * quantity;

            total_price += subtotal;

            orderItems.push({
                product_id,
                quantity,
                price,
                subtotal,
            });
        }

        // Menyimpan pesanan utama
        const [orderResult] = await connection.execute(
            `INSERT INTO orders
            (user_id, total_price, status)
            VALUES (?, ?, ?)`,
            [user_id, total_price, "pending"]
        );

        const order_id = orderResult.insertId;

        // Menyimpan detail pesanan
        for (const item of orderItems) {
            await connection.execute(
                `INSERT INTO order_items
                (order_id, product_id, quantity, price, subtotal)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    order_id,
                    item.product_id,
                    item.quantity,
                    item.price,
                    item.subtotal,
                ]
            );
        }

        await connection.commit();

        return res.status(201).json({
            message: "Pesanan berhasil dibuat",
            data: {
                order_id,
                user_id,
                total_price,
                status: "pending",
                items: orderItems,
            },
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        return res.status(500).json({
            message: error.message || "Terjadi kesalahan saat membuat pesanan",
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

//mengambil riwayat pesanan customer
const getMyOrder = async (req, res) => {
    try{
        const user_id = req.user.userId;
        const [orders] = await db.execute(
            `SELECT 
                id,
                total_price,
                status
            FROM orders
            WHERE user_id = ?
            ORDER BY id DESC`,
            [user_id]
        );
        
        return res.status(200).json({
            message:"Riwayat pesanan berhasil diambil",
            data: orders,
        });
    } catch (error) {
        return res.status(500).json ({
            message: "Terjadi kesalagam saat mengambil riwayat pesanan",
        });
    }

};

//mengambil detail pesanan order

const getOrderDetail = async (req, res) => {
    try{
        const user_id = req.user.userId;
        const { id } = req.params;

        // Mengambil data pesanan utama
        const [orders] = await db.execute(
            `SELECT id, total_price, status
             FROM orders
             WHERE id = ? AND user_id = ?`,
            [id, user_id]
        );

        if (orders.length === 0 ) {
            return res.status(404).json({
                message: "pesanan tidak ditemukan",
            
            });
        }
        //mengambil produk pesanan 
                const [items] = await db.execute(
            `SELECT
                products.name AS product_name,
                order_items.quantity,
                order_items.price,
                order_items.subtotal
             FROM order_items
             JOIN products ON order_items.product_id = products.id
             WHERE order_items.order_id = ?`,
            [id]
        );
        return res.status(200).json({
            message : "detail pesanan berhasil diambil ",
            data:{
                 ...orders[0],
                items,
            },
        });
    } catch(error){
        return res.status(500).json({
            message: "terjadi kesalahan saat mengambil detail pesanan",
        });
    }
};


// Mengubah status pesanan (admin dan kasir)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "processing",
            "completed",
            "cancelled",
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "status pesanan tidak valid",
                received: status,
            });
        }

        const [orders] = await db.execute(
            "SELECT id FROM orders WHERE id = ?",
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                message: "pesanan tidak ditemukan",
            });
        }

        await db.execute(
            "UPDATE orders SET status = ? WHERE id = ?",
            [status, id]
        );

        return res.status(200).json({
            message: "status pesanan berhasil diperbarui",
            data: {
                order_id: Number(id),
                status,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "terjadi kesalahan saat mengubah status pesanan",
        });
    }
};

//mengambil semua pesanan (admin dan kasir)
const getAllOrders = async (req, res) => {
    try{
        const[orders] = await db.execute(`
            SELECT
                orders.id,
                orders.user_id,
                users.name AS customer_name,
                orders.total_price,
                orders.status
            FROM orders
            JOIN users ON orders.user_id = users.id
            ORDER BY orders.id DESC 
            `);
            return res.status(200).json({
                message: "semua pesanan berhasil diambiil",
                data: orders,
            });
    } catch(error){
        console.error(error);
        

        return res.status(500).json({
            message: "terjadi kesalahan saat mengambil pesanan",
        });
    }
};


const deleteMyOrder = async (req, res) => {

}

module.exports = {
    createOrder,
    getMyOrder,
    getOrderDetail,
    updateOrderStatus,
    getAllOrders,
};
