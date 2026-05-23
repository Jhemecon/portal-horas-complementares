import { Router } from "express";
import { getAllUsers, registerUser, loginUser, getMe } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

// A grande vantagem: não precisamos mais repetir o "/api/users" em todas as linhas!
// O arquivo main.ts vai cuidar de colocar esse prefixo.
router.get("/", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getMe);

export default router;