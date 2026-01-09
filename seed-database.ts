import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { researchers, type InsertResearcher } from "./shared/schema";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const seedData: InsertResearcher[] = [
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

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with researchers...');
    
    const existingResearchers = await db.select().from(researchers);
    
    if (existingResearchers.length > 0) {
      console.log(`✅ Database already contains ${existingResearchers.length} researchers. Skipping seed.`);
      process.exit(0);
    }
    
    await db.insert(researchers).values(seedData);
    
    console.log(`✅ Successfully seeded ${seedData.length} researchers!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
