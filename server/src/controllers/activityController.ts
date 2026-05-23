import { Request, Response } from "express";
import { db } from "../db/index.js";
import { activities } from "../db/schema.js";

export const getAllActivities = async (_req: Request, res: Response) => {
  try {
    const allActivities = await db.select().from(activities);
    res.json(allActivities);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar atividades" });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { name, description, maxHoursPerActivity } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        error: "O campo 'name' está vazio! Verifique se enviou os dados no formato raw -> JSON." 
      });
    }

    const newActivity = await db.insert(activities).values({
      name,
      description,
      maxHoursPerActivity
    }).returning();

    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    res.status(500).json({ error: "Erro ao criar atividade" });
  }
};