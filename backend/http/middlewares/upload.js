import multer from "multer";
import path from "path";
import fs from "fs";

const assignmentDir = "uploads/assignments";
const questionDir = "uploads/questions";

[assignmentDir, questionDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, unique + path.extname(file.originalname));
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error("Only PDF and Word documents allowed"));
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

export const uploadAssignment = multer({ storage: createStorage(assignmentDir), fileFilter, limits });
export const uploadQuestion = multer({ storage: createStorage(questionDir), fileFilter, limits });