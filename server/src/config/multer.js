import multer from "multer";
import { __dirname } from '../path.js'
import fs from 'fs'
import path from "path";
//Configurar guardado de imagenes
const storageDocs = multer.diskStorage({
    destination: (req, file, cb) => {
        const { uid } = req.params;

        if (!uid) {
            return cb(new Error("No se proporcionó un UID"), null);
        }

        const userFolder = path.join(__dirname, "public", "docs", uid);

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/products`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

export const uploadDocs = multer({ storage: storageDocs })
export const uploadProds = multer({ storage: storageProducts })