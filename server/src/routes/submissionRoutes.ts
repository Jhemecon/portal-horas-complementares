import { Router } from "express";
import { createSubmission, getMySubmissions } from "../controllers/submissionController.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Nova rota: Quando o React pedir um GET, devolvemos a lista
router.get("/", verifyToken, getMySubmissions);

// Rota antiga: Quando o React enviar um POST, guardamos o PDF
router.post("/", verifyToken, upload.single("certificate"), createSubmission);

export default router;