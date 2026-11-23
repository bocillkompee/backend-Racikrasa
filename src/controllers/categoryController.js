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

        //mengubah kategori
        const updateCategory = async (req, res) => {
            try {
                const {id} = req.params;
                const {name} = req.body;

                //validasi input 
                if (!name) {
                    return res.status (400).json({
                        message: "name kategori harus diisi"
                    });
                }
            

            //cek apakah kategori tersedia
            const [categories] = await db.execute (
                "SELECT * FROM categories WHERE id = ?",
                [id]
            );
        

        if (categories.length === 0) {
                return res.status(404).json({
                    message: "Kategori tidak ditemukan",
                });
            }
        
            //update kategori 
            await db.execute(
                "UPDATE categories SET name = ? WHERE id = ?",
                [name, id]
            );

            return res.status (200).json({
                message: "kategori berhasil diperbarui"
            });

        } catch (error) {
            console.error ("update category error:", error);


            return res.status(500).json({
                message: "terjadi kesalahan pada server",
            });
        } 

    };



    //menghapus kategori
    const deleteCategory = async (req, res) => {
        try{
            const {id} = req.params;
            
            // Cek apakah kategori masih digunakan produk
            const [products] = await db.execute(
                "SELECT id FROM products WHERE category_id = ?",
                [id]
            );
            
            if (products.length > 0) {
                return res.status(400).json({
                    message: "Kategori tidak bisa dihapus karena masih digunakan oleh produk",
                });
            }
            
            //cek apakah kategori tersedi
            const [categories] = await db.execute (
                "SELECT * FROM categories WHERE id = ?",
                [id]
            );

            if(categories.length === 0){
                return res.status(404).json({
                    message: "kategori tidak ditemukan",
                });
            }
            //menghapus kategori
            await db.execute(
                "DELETE FROM categories WHERE id = ?",
                [id]
            );
            
            return res.status(200).json ({
                message: "kategori berhasil di hapus",
            });
        } catch (error) {
            console.error("Delete category error:", error);
            

            return res.status(500).json({
                message: "terjadi kesalahan pada server "
            });
        }
        
    };
        


    module.exports = {
        createCategory,
        getAllCategories,
        updateCategory,
        deleteCategory,
    };

 