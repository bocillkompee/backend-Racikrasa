
const bcrypt = require("bcrypt");
const db = require("../config/database");
const jwt = require("jsonwebtoken");

// Register Customer
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password harus diisi",
      });
    }

    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, "customer"]
    );

    return res.status(201).json({
      message: "Registrasi berhasil",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

// Login Customer
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password harus diisi",
      });
    }

    const [customers] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (customers.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const customer = customers[0];

    const passwordMatch = await bcrypt.compare(
      password,
      customer.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
      {
        userId: customer.id,
        role: customer.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};