require("dotenv").config();
const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");  
const productRoutes = require("./routes/productRoutes")
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);


//tes apakah server berjalan
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");

    res.status(200).json({
         message: "Koneksi ke database berhasil", 
         data: rows 
});
  } catch (error) {
  console.error("Database error:", error);

  res.status(500).json({
    message: "Koneksi ke database gagal",
    error: error.message,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});