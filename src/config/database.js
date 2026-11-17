const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
ssl: {
    ca: fs.readFileSync(
        path.join(__dirname, "/../../certs/ca.pem")
    ),
},
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});

module.exports = db;