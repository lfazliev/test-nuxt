import multer from 'multer'
export default defineEventHandler((event) => {
    try {
        const storageConfig = multer.diskStorage({
            destination: (req: any, file: any, cb: any) => {
                cb(null, "~/public");
                // cb(null, "./public/assets");
            },
            filename: (req: any, file: any, cb: any) => {
                cb(null, file.originalname);
            }
        })
    }
    catch (e) {
        console.log(e)
    }
})