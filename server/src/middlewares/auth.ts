import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Criamos um "tipo" para avisar o TypeScript que a requisição agora terá os dados do usuário
export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Pega o token do cabeçalho da requisição (padrão: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    // 2. Extrai apenas o token, tirando a palavra "Bearer "
    const token = authHeader.split(" ")[1];

    // 3. Verifica se o token é válido e se a assinatura bate com a nossa chave secreta
    const secret = process.env.JWT_SECRET || "chave_secreta_super_segura_do_ciesa";
    const decoded = jwt.verify(token, secret);

    // 4. Guarda os dados do usuário na requisição e libera a passagem para a rota!
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};