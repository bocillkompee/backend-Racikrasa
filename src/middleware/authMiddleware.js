const jwt = require("jsonwebtoken");


//memeriksa token jwt
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        //memeriksa apakah token ada
        if (!authHeader) {
            return res.status(401).json({ 
                message: "Token tidak ditemukan" ,
            });
        }

        const token = authHeader.split(" ")[1];

        //memeriksa token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        //menyimpan data user dari token
        req.user = decoded;

        next();
    }catch (error) {
        return res.status(401).json({
            message: "Token tidak valid",
        });
    }
};
        
module.exports = { verifyToken };