import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__filename,__dirname)

dotenv.config({ path: path.resolve(__dirname, "../../.env") });


import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("ENV CHECK:", process.env.JWT_SECRET,process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET,
);

// Use memory storage instead of cloudinary storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export { cloudinary };