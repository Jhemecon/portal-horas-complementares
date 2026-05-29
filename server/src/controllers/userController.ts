import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { AuthRequest } from "../middlewares/auth.js";

// 1. Buscar todos os usuários
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      registrationNumber: users.registrationNumber,
      role: users.role,
      courseId: users.courseId,
      createdAt: users.createdAt,
    }).from(users);

    res.json(allUsers);
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error);
    res.status(500).json({ error: "Erro interno ao buscar utilizadores" });
  }
};

// 2. Cadastrar usuário
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, registrationNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e palavra-passe são obrigatórios." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      registrationNumber,
      role: "student",
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    });

    res.status(201).json({ message: "Utilizador criado com sucesso!", user: newUser });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "Email ou matrícula já registados." });
    }
    res.status(500).json({ error: "Erro interno ao registar utilizador" });
  }
};

// 3. Fazer Login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e palavra-passe são obrigatórios." });
    }

    const userResult = await db.select().from(users).where(eq(users.email, email));
    
    if (userResult.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const user = userResult[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || "chave_secreta_super_segura_do_ciesa", 
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login efetuado com sucesso!",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao efetuar login" });
  }
};

// 4. Buscar Perfil (Protegido)
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const userResult = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      registrationNumber: users.registrationNumber,
      role: users.role,
      courseId: users.courseId,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, userId));

    if (userResult.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(userResult[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
};