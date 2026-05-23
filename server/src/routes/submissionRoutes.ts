import { Router } from "express";
import { createSubmission } from "../controllers/submissionController.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Aqui aplicamos os middlewares de segurança (Token) e de Upload (Multer) antes de chamar o Controller
router.post("/", verifyToken, upload.single("certificate"), createSubmission);

export default router;