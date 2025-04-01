import multer from "multer";

const storage = multer.diskStorage({})

const upload = multer({ storage })

export default upload

// import multer from 'multer';

// // Configure storage (Multer will store files in memory, we send to Cloudinary directly)
// const storage = multer.memoryStorage();

// // Validate file type and size
// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// };

// // Set upload limits (5MB max size)
// const upload = multer({ 
//   storage, 
//   fileFilter, 
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// export default upload;

