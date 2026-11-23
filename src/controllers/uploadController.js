const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

//upload gambar ke cloudinary  

const uploadImage = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                message: "gambar harus di unggah",
            });
        }
        const streamUpload = () => {
             return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "racikrasa/products",
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        const result = await streamUpload();
        return res.status(200).json({
            message: "gambbar berhasil di unggah",
            imageURL: result.secure_URL,
        });
    }catch (error){
        console.error("upload image error:", error )

        return res.status(500).json({
            message: "gagal mengunggah gambar",
        });
    }
}

module.exports = {
    uploadImage,
};

