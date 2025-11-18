import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { matchProblemToResearchers } from "./matching";
import { insertResearcherSchema, insertClinicianProblemSchema } from "@shared/schema";
import type { ProblemWithMatches } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/researchers", async (req, res) => {
    try {
      const validatedData = insertResearcherSchema.parse(req.body);
      const researcher = await storage.createResearcher(validatedData);
      res.json(researcher);
    } catch (error: any) {
      res.status(400).json({ 
        error: "Invalid researcher data", 
        details: error.message 
      });
    }
  });

  app.get("/api/researchers", async (_req, res) => {
    try {
      const researchers = await storage.getAllResearchers();
      res.json(researchers);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to fetch researchers", 
        details: error.message 
      });
    }
  });

  app.post("/api/clinician-problems", async (req, res) => {
    try {
      const validatedData = insertClinicianProblemSchema.parse(req.body);
      
      const problem = await storage.createClinicianProblem(validatedData);
      
      const researchers = await storage.getAllResearchers();
      
      if (researchers.length === 0) {
        const response: ProblemWithMatches = {
          problem,
          matches: [],
        };
        return res.json(response);
      }
      
      const matchScores = matchProblemToResearchers(
        validatedData.description,
        researchers,
        5
      );
      
      const matchData = matchScores.map((match, index) => ({
        researcherId: match.researcherId,
        score: match.score,
        rank: index + 1,
      }));
      
      await storage.createMatches(problem.id, matchData);
      
      const matches = await storage.getMatchesByProblemId(problem.id);
      
      const response: ProblemWithMatches = {
        problem,
        matches,
      };
      
      res.json(response);
    } catch (error: any) {
      console.error("Error processing clinician problem:", error);
      res.status(400).json({ 
        error: "Failed to process problem", 
        details: error.message 
      });
    }
  });

  app.get("/api/matches/:problemId", async (req, res) => {
    try {
      const { problemId } = req.params;
      
      const problem = await storage.getClinicianProblemById(problemId);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      const matches = await storage.getMatchesByProblemId(problemId);
      
      const response: ProblemWithMatches = {
        problem,
        matches,
      };
      
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Failed to fetch matches", 
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
