import multer from "multer";
import path from "path";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

// local storage for docs
const dirs = ["uploads/assignments", "uploads/questions"];
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const createLocalStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, unique + path.extname(file.originalname));
    },
  });

const docFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error("Only PDF and Word documents allowed"));
};

const videoFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only video files allowed"));
};

// Cloudinary storage for videos
const cloudinaryVideoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lms/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
  },
});

const docLimits = { fileSize: 10 * 1024 * 1024 };    // 10MB
const videoLimits = { fileSize: 500 * 1024 * 1024 };  // 500MB

export const uploadAssignment = multer({
  storage: createLocalStorage("uploads/assignments"),
  fileFilter: docFilter,
  limits: docLimits,
});

export const uploadQuestion = multer({
  storage: createLocalStorage("uploads/questions"),
  fileFilter: docFilter,
  limits: docLimits,
});

export const uploadVideo = multer({
  storage: cloudinaryVideoStorage,
  fileFilter: videoFilter,
  limits: videoLimits,
});