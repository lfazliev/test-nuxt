import multer from 'multer'
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, "../client/src/assets");
        cb(null, "../../public");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
export default defineEventHandler(() => {
    multer({ storage: storageConfig }).single("file")
})