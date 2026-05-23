import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./src/routes/userRoutes.js";
import activityRoutes from "./src/routes/activityRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";

dotenv.config({ path: ".env" });

const app = express();
app.use(cors());
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