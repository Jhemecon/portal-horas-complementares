import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Carrega as variáveis do ficheiro .env para que o Drizzle consiga ler a Connection String
dotenv.config();

if (!process.env.DB_CONNECTION_URL) {
  throw new Error("A variável DB_CONNECTION_URL não está definida no ficheiro .env");
}

export default defineConfig({
  // O caminho onde vamos criar as nossas tabelas (o modelo lógico)
  schema: "./src/db/schema.ts",
  
  // Onde o Drizzle vai guardar o histórico de migrações (ficheiros SQL gerados)
  out: "./src/db/migrations",
  
  // O motor da base de dados que escolhemos (Neon usa Postgres)
  dialect: "postgresql",
  
  // As credenciais de acesso, apontando para a variável que configurou no Neon
  dbCredentials: {
    url: process.env.DB_CONNECTION_URL,
  },
  
  // Opções extra para ajudar no desenvolvimento, avisando caso haja erros no schema
  verbose: true,
  strict: true,
});