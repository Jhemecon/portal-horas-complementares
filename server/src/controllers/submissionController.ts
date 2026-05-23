import { Response } from "express";
import { db } from "../db/index.js";
import { submissions } from "../db/schema.js";
import { AuthRequest } from "../middlewares/auth.js";

export const createSubmission = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Por favor, anexe o arquivo do certificado." });
    }

    const { title, hoursClaimed, activityId } = req.body;

    if (!title || !hoursClaimed || !activityId) {
      return res.status(400).json({ error: "Título, horas e ID da atividade são obrigatórios." });
    }

    const certificateUrl = `/uploads/${req.file.filename}`;
    const studentId = req.user.id; // Pegamos do token!

    const newSubmission = await db.insert(submissions).values({
      studentId,
      activityId,
      title,
      hoursClaimed: parseInt(hoursClaimed as string), 
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