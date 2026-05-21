import { pgTable, uuid, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Definição de Enums para controlar os papéis e os estados das validações
export const roleEnum = pgEnum("user_role", ["student", "coordinator", "admin"]);
export const statusEnum = pgEnum("submission_status", ["pending", "approved", "rejected"]);

// 2. Tabela de Cursos (Para associar a carga horária necessária de cada curso)
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  totalHoursRequired: integer("total_hours_required").notNull().default(300),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Tabela de Utilizadores
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Será encriptada com o bcryptjs
  registrationNumber: text("registration_number").unique(), // Número de matrícula do estudante
  role: roleEnum("role").default("student").notNull(),
  courseId: uuid("course_id").references(() => courses.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Tabela de Categorias/Atividades (Ex: Projetos de Extensão, Palestras, Estágios)
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  maxHoursPerActivity: integer("max_hours_per_activity").notNull(), // Limite regulamentar
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Tabela de Submissões de Certificados
export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  activityId: uuid("activity_id").references(() => activities.id).notNull(),
  title: text("title").notNull(), // Nome do evento/certificado
  hoursClaimed: integer("hours_claimed").notNull(), // Horas que o aluno pede
  hoursApproved: integer("hours_approved"), // Horas validadas pelo coordenador
  status: statusEnum("status").default("pending").notNull(),
  certificateUrl: text("certificate_url").notNull(), // Caminho guardado pelo Multer
  rejectionReason: text("rejection_reason"), // Feedback em caso de recusa
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==========================================
// RELAÇÕES (Facilita a criação de queries complexas no Drizzle)
// ==========================================

export const usersRelations = relations(users, ({ one, many }) => ({
  course: one(courses, { fields: [users.courseId], references: [courses.id] }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  student: one(users, { fields: [submissions.studentId], references: [users.id] }),
  activity: one(activities, { fields: [submissions.activityId], references: [activities.id] }),
}));