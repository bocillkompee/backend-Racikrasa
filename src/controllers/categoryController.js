const db = require("../config/database");

//menambahkan kategori baru
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        //validasi input
        if (!name) {
            return res.status(400).json({
                message: "Nama kategori harus diisi",
            });
        }

        //menyimpan kategori baru ke database
        const [result] = await db.execute(
            "INSERT INTO categories (name) VALUES (?)",
            [name]
        );

        return res.status(201).json({
            message: "Kategori berhasil ditambahkan",
            categoryId: result.insertId,
        });
    } catch (error) {
        console.error("Create category error:", error);
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });
    }
};

//menampilkan semua kategori
const getAllCategories = async (req, res) => {
    try{
        const [categories] = await db.execute(
            "SELECT * FROM categories ORDER BY id DESC"
        );
        
        return res.status(200).json({
            message: "Data Kategori berhasil diambil",
            data: categories,
        });
    }catch  (error) {
        console.error("Get categories error:", error);
        
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
        });

        }
    }
    


module.exports = {
    createCategory,
    getAllCategories,
};

