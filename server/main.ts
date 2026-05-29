import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./src/routes/userRoutes.js";
import activityRoutes from "./src/routes/activityRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";

dotenv.config({ path: ".env" });

const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(apiLimiter);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "server/uploads")));

// Rota de Teste de Status
app.get("/api/status", (_req, res) => {
  res.json({ status: "online", message: "Servidor do Portal CIESA rodando 100%!" });
});

// ==========================================
// DELEGAÇÃO DE ROTAS (Padrão MVC)
// ==========================================
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado na porta ${PORT}`);
});