import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadDocument,
  getDocumentsByEmployee,
} from "../controllers/documentController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");    // make uploads/ inside backend root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload
router.post("/", protect, upload.single("file"), uploadDocument);

// Fetch employee documents
router.get("/:employeeId", protect, getDocumentsByEmployee);

export default router;
``