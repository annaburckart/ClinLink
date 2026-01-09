import { 
  type Researcher, 
  type InsertResearcher,
  type ClinicianProblem,
  type InsertClinicianProblem,
  type Match,
  type MatchResult,
  researchers,
  clinicianProblems,
  matches
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;

export interface IStorage {
  createResearcher(researcher: InsertResearcher): Promise<Researcher>;
  getAllResearchers(): Promise<Researcher[]>;
  getResearcherById(id: string): Promise<Researcher | undefined>;
  
  createClinicianProblem(problem: InsertClinicianProblem): Promise<ClinicianProblem>;
  getClinicianProblemById(id: string): Promise<ClinicianProblem | undefined>;
  
  createMatches(problemId: string, matches: Array<{ researcherId: string; score: number; rank: number }>): Promise<Match[]>;
  getMatchesByProblemId(problemId: string): Promise<MatchResult[]>;
}

export class MemStorage implements IStorage {
  private researchers: Map<string, Researcher>;
  private clinicianProblems: Map<string, ClinicianProblem>;
  private matches: Map<string, Match>;

  constructor() {
    this.researchers = new Map();
    this.clinicianProblems = new Map();
    this.matches = new Map();
    
    this.seedResearchers();
  }

  private seedResearchers() {
    const seedData: Array<Omit<InsertResearcher, 'institution'> & { institution?: string }> = [
      {
        name: "Dr. Sarah Chen",
        email: "s.chen@medresearch.edu",
        institution: "Stanford Medical Center",
        keywords: ["antibiotic resistance", "infectious diseases", "hospital-acquired infections", "antimicrobial stewardship"],
        description: "Specializing in combating antibiotic-resistant infections in hospital settings. My research focuses on developing evidence-based prophylactic strategies for post-operative patients, particularly in cardiac surgery.",
        capacity: 3
      },
      {
        name: "Dr. Michael Rodriguez",
        email: "m.rodriguez@heartinstitute.org",
        institution: "Mayo Clinic Heart Institute",
        keywords: ["heart failure", "cardiology", "patient readmission", "care coordination"],
        description: "Expert in heart failure management with a focus on reducing 30-day readmission rates. My work includes developing comprehensive discharge planning protocols and remote monitoring systems for heart failure patients.",
        capacity: 2
      },
      {
        name: "Dr. Jennifer Kim",
        email: "j.kim@telemedicine.edu",
        institution: "Johns Hopkins Telemedicine Center",
        keywords: ["telemedicine", "chronic pain", "rural health", "digital health"],
        description: "Leading research on telemedicine interventions for underserved populations. Specialized in remote chronic pain management and developing accessible digital health solutions for rural communities.",
        capacity: 4
      },
      {
        name: "Dr. David Thompson",
        email: "d.thompson@oncology.org",
        institution: "MD Anderson Cancer Center",
        keywords: ["oncology", "cancer treatment", "immunotherapy", "clinical trials"],
        description: "Cancer research specialist focusing on novel immunotherapy approaches and patient-centered clinical trial design. Experience with treatment adherence and quality of life outcomes in cancer patients.",
        capacity: 1
      },
      {
        name: "Dr. Lisa Patel",
        email: "l.patel@diabetes.edu",
        institution: "Joslin Diabetes Center",
        keywords: ["diabetes", "chronic disease management", "patient adherence", "behavioral health"],
        description: "Research focused on improving medication adherence in patients with chronic conditions, particularly diabetes. Expertise in behavioral interventions and patient education strategies.",
        capacity: 3
      },
      {
        name: "Dr. Robert Anderson",
        email: "r.anderson@surgery.org",
        institution: "Cleveland Clinic",
        keywords: ["surgery", "post-operative care", "infection prevention", "quality improvement"],
        description: "Surgeon-scientist studying surgical site infection prevention and post-operative outcomes. Research includes developing quality improvement protocols for surgical departments.",
        capacity: 2
      },
      {
        name: "Dr. Emily Martinez",
        email: "e.martinez@geriatrics.edu",
        institution: "UCLA Geriatrics Institute",
        keywords: ["geriatrics", "elderly care", "falls prevention", "dementia care"],
        description: "Geriatrics researcher specializing in fall prevention and cognitive health in older adults. Work includes developing comprehensive care models for elderly patients with multiple comorbidities.",
        capacity: 5
      },
      {
        name: "Dr. James Wilson",
        email: "j.wilson@pulmonary.org",
        institution: "National Jewish Health",
        keywords: ["pulmonary medicine", "COPD", "respiratory diseases", "rehabilitation"],
        description: "Pulmonary disease specialist with expertise in COPD management and pulmonary rehabilitation programs. Research focuses on improving quality of life and reducing hospital readmissions in respiratory patients.",
        capacity: 3
      }
    ];

    seedData.forEach(data => {
      const id = randomUUID();
      const researcher: Researcher = { 
        ...data, 
        id,
        institution: data.institution ?? null,
        capacity: data.capacity ?? 1
      };
      this.researchers.set(id, researcher);
    });
  }

  async createResearcher(insertResearcher: InsertResearcher): Promise<Researcher> {
    const id = randomUUID();
    const researcher: Researcher = { 
      ...insertResearcher, 
      id,
      institution: insertResearcher.institution ?? null,
      capacity: insertResearcher.capacity ?? 1
    };
    this.researchers.set(id, researcher);
    return researcher;
  }

  async getAllResearchers(): Promise<Researcher[]> {
    return Array.from(this.researchers.values());
  }

  async getResearcherById(id: string): Promise<Researcher | undefined> {
    return this.researchers.get(id);
  }

  async createClinicianProblem(insertProblem: InsertClinicianProblem): Promise<ClinicianProblem> {
    const id = randomUUID();
    const problem: ClinicianProblem = {
      ...insertProblem,
      id,
      submittedAt: new Date(),
    };
    this.clinicianProblems.set(id, problem);
    return problem;
  }

  async getClinicianProblemById(id: string): Promise<ClinicianProblem | undefined> {
    return this.clinicianProblems.get(id);
  }

  async createMatches(
    problemId: string,
    matchData: Array<{ researcherId: string; score: number; rank: number }>
  ): Promise<Match[]> {
    const matches: Match[] = [];
    
    for (const data of matchData) {
      const id = randomUUID();
      const match: Match = {
        id,
        problemId,
        researcherId: data.researcherId,
        score: data.score,
        rank: data.rank,
      };
      this.matches.set(id, match);
      matches.push(match);
    }
    
    return matches;
  }

  async getMatchesByProblemId(problemId: string): Promise<MatchResult[]> {
    const problemMatches = Array.from(this.matches.values())
      .filter(match => match.problemId === problemId)
      .sort((a, b) => a.rank - b.rank);

    const results: MatchResult[] = [];
    
    for (const match of problemMatches) {
      const researcher = await this.getResearcherById(match.researcherId);
      if (researcher) {
        results.push({
          researcher,
          score: match.score,
          rank: match.rank,
        });
      }
    }
    
    return results;
  }
}

export class DbStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async createResearcher(insertResearcher: InsertResearcher): Promise<Researcher> {
    const [researcher] = await this.db
      .insert(researchers)
      .values(insertResearcher)
      .returning();
    return researcher;
  }

  async getAllResearchers(): Promise<Researcher[]> {
    return await this.db.select().from(researchers);
  }

  async getResearcherById(id: string): Promise<Researcher | undefined> {
    const [researcher] = await this.db
      .select()
      .from(researchers)
      .where(eq(researchers.id, id));
    return researcher;
  }

  async createClinicianProblem(insertProblem: InsertClinicianProblem): Promise<ClinicianProblem> {
    const [problem] = await this.db
      .insert(clinicianProblems)
      .values(insertProblem)
      .returning();
    return problem;
  }

  async getClinicianProblemById(id: string): Promise<ClinicianProblem | undefined> {
    const [problem] = await this.db
      .select()
      .from(clinicianProblems)
      .where(eq(clinicianProblems.id, id));
    return problem;
  }

  async createMatches(
    problemId: string,
    matchData: Array<{ researcherId: string; score: number; rank: number }>
  ): Promise<Match[]> {
    const matchValues = matchData.map(data => ({
      problemId,
      researcherId: data.researcherId,
      score: data.score,
      rank: data.rank,
    }));

    return await this.db
      .insert(matches)
      .values(matchValues)
      .returning();
  }

  async getMatchesByProblemId(problemId: string): Promise<MatchResult[]> {
    const problemMatches = await this.db
      .select()
      .from(matches)
      .where(eq(matches.problemId, problemId))
      .orderBy(matches.rank);

    const results: MatchResult[] = [];
    
    for (const match of problemMatches) {
      const researcher = await this.getResearcherById(match.researcherId);
      if (researcher) {
        results.push({
          researcher,
          score: match.score,
          rank: match.rank,
        });
      }
    }
    
    return results;
  }
}

export const storage = new DbStorage();
