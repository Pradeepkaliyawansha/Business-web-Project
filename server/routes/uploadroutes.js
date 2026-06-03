import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we'll stream the buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// @route   POST /api/upload
// @access  Private/Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded." });
      }

      // Upload buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "dilos-gadget/products", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

// @route   DELETE /api/upload/:public_id
// @access  Private/Admin
router.delete("/:public_id", protect, adminOnly, async (req, res) => {
  try {
    // public_id may contain slashes encoded as %2F
    const public_id = decodeURIComponent(req.params.public_id);
    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, message: "Image deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
