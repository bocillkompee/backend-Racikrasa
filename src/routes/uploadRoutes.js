const express = require("express");
const router = express.Router();

const { uploadImage } = require("../controllers/uploadController");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");
const { verifyRole } = require("../middleware/roleMiddleware");

router.post(
    "/",
    verifyToken,
    verifyRole("admin"),
    upload.single("image"),
    uploadImage
);

module.exports = router;