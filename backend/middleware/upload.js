import multer from "multer";

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {

    const allowed = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",

        "model/gltf-binary",

        "application/octet-stream"
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"));
    }

};

const upload = multer({

    storage,

    fileFilter: imageFilter,

    limits: {

        fileSize: 100 * 1024 * 1024,

    },

});

export default upload;