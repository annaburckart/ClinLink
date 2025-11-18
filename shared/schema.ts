import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const researchers = pgTable("researchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  institution: text("institution"),
  keywords: text("keywords").array().notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull().default(1),
});

export const clinicianProblems = pgTable("clinician_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  keywords: text("keywords").array().notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  problemId: varchar("problem_id").notNull().references(() => clinicianProblems.id),
  researcherId: varchar("researcher_id").notNull().references(() => researchers.id),
  score: real("score").notNull(),
  rank: real("rank").notNull(),
});

export const insertResearcherSchema = createInsertSchema(researchers).omit({ id: true });
export const insertClinicianProblemSchema = createInsertSchema(clinicianProblems).omit({ id: true, submittedAt: true });

export type InsertResearcher = z.infer<typeof insertResearcherSchema>;
export type Researcher = typeof researchers.$inferSelect;

export type InsertClinicianProblem = z.infer<typeof insertClinicianProblemSchema>;
export type ClinicianProblem = typeof clinicianProblems.$inferSelect;

export type Match = typeof matches.$inferSelect;

export interface MatchResult {
  researcher: Researcher;
  score: number;
  rank: number;
}

export interface ProblemWithMatches {
  problem: ClinicianProblem;
  matches: MatchResult[];
}
