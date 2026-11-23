const db = require("../config/database");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Menambahkan produk baru
const createProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, image } = req.body;

        // Validasi input
        if (!category_id || !name || !price) {
            return res.status(400).json({
                message: "Kategori, nama produk, dan harga harus diisi",
            });
        }

        //validasi gambar
        if(!req.file) {
            return res.status(400).json ({
                message: "gambar produk harus diunggah",
            });
        }

        //upload gambar ke cloudinary
        const imageURL = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "racikrasa/products",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        // Menyimpan produk ke database
        const [result] = await db.execute(
            `INSERT INTO products
            (category_id, name, description, price, image)
            VALUES (?, ?, ?, ?, ?)`,
            [category_id, name, description, price, imageURL]
        );

        return res.status(201).json({
            message: "Produk berhasil ditambahkan",
            productId: result.insertId,
            image: imageURL,
        });

    } catch (error) {
        console.error("Create product error:", error);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });
    }
};

// Menampilkan semua produk
const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute(
            `SELECT 
                products.*,
                categories.name AS category_name
            FROM products
            JOIN categories ON products.category_id = categories.id
            ORDER BY products.id DESC`
        );

        return res.status(200).json({
            message: "Data produk berhasil diambil",
            data: products,
        });

    } catch (error) {
        console.error("Get products error:", error);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });
    }
};

// Mengubah data produk
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, name, description, price } = req.body;

        // Validasi input
        if (!category_id || !name || !price) {
            return res.status(400).json({
                message: "Kategori, nama produk, dan harga harus diisi",
            });
        }

        // Cek apakah produk tersedia
        const [products] = await db.execute(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan",
            });
        }

        // Menggunakan gambar lama
        let imageURL = products[0].image;

        // Jika ada gambar baru, upload ke Cloudinary
        if (req.file) {
            imageURL = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "racikrasa/products",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        }

        // Update produk
        await db.execute(
            `UPDATE products
            SET category_id = ?, name = ?, description = ?, price = ?, image = ?
            WHERE id = ?`,
            [category_id, name, description, price, imageURL, id]
        );

        return res.status(200).json({
            message: "Produk berhasil diperbarui",
            image: imageURL,
        });

    } catch (error) {
        console.error("Update product error:", error);

        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
    const { id } = req.params;    

    const [result] = await db.execute(
         "DELETE FROM products WHERE id = ?",
         [id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json ({
            message: "produk tidak ditemukan",
        });
    }

    return res.status(200).json ({
        message: "Produk berhasil dihapus",
         });
    } catch(error){
        console.error("Error delete product:", error);
        


        return res.status(500).json({
            message: "Gagal menghapus produk",
        });
    }
    
};


module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};