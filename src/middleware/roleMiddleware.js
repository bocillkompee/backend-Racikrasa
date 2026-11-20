//memeriksa role user
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        //memeriksa apakah role user diizinkan
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Anda tidak memiliki akses",
            });
        }
        next();
    };
};

module.exports = { verifyRole };