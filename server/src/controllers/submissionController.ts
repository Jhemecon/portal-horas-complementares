import { Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { submissions } from "../db/schema.js";
import { AuthRequest } from "../middlewares/auth.js";

// --- NOVA FUNÇÃO: Buscar os certificados do aluno logado ---
export const getMySubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user.id;
    // Puxa do banco apenas as submissões deste aluno específico
    const mySubmissions = await db.select().from(submissions).where(eq(submissions.studentId, studentId));
    
    res.json(mySubmissions);
  } catch (error) {
    console.error("Erro ao buscar submissões:", error);
    res.status(500).json({ error: "Erro ao buscar certificados." });
  }
};

export const createSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Por favor, anexe o arquivo do certificado." });
    }

    const { title, hoursClaimed, activityId } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "O título é obrigatório." });
    }

    const hours = Number(hoursClaimed);
    if (!Number.isFinite(hours) || hours <= 0) {
      return res.status(400).json({ error: "As horas reclamadas devem ser um número maior que zero." });
    }

    if (!activityId || typeof activityId !== "string") {
      return res.status(400).json({ error: "O ID da atividade é obrigatório." });
    }

    const certificateUrl = `/uploads/${req.file.filename}`;
    const studentId = req.user.id;

    const newSubmission = await db.insert(submissions).values({
      studentId,
      activityId,
      title: title.trim(),
      hoursClaimed: hours,
      certificateUrl,
      status: "pending"
    }).returning();

    res.status(201).json({ 
      message: "Upload e registro efetuados com sucesso!", 
      submission: newSubmission
    });

  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao processar o certificado." });
  }
};