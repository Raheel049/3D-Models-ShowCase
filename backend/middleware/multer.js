import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true)
    }else{
        cb(new Error("Only image files are upload"), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fieldSize: 2*1024*1024,
    }
});

export default upload 