import natural from 'natural';
import type { Researcher, ClinicianProblem } from '@shared/schema';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

export interface MatchScore {
  researcherId: string;
  score: number;
}

export function matchProblemToResearchers(
  problem: ClinicianProblem,
  researchers: Researcher[],
  topN: number = 5
): MatchScore[] {
  if (researchers.length === 0) {
    return [];
  }

  const tfidf = new TfIdf();
  
  const problemKeywords = problem.keywords.map(k => k.toLowerCase()).join(' ');
  const problemText = `${problem.title.toLowerCase()} ${problem.domain.toLowerCase()} ${problemKeywords} ${problem.description.toLowerCase()}`;
  tfidf.addDocument(problemText);
  
  researchers.forEach(researcher => {
    const keywords = researcher.keywords.map(k => k.toLowerCase()).join(' ');
    const researcherText = `${researcher.description.toLowerCase()} ${keywords}`;
    tfidf.addDocument(researcherText);
  });

  const scores: MatchScore[] = [];
  const problemTerms = tokenizer.tokenize(problemText) || [];
  
  if (problemTerms.length === 0) {
    return researchers.slice(0, topN).map((r, idx) => ({
      researcherId: r.id,
      score: 0.5,
    }));
  }

  let maxScore = 0;
  const rawScores: Array<{ researcherId: string; rawScore: number }> = [];
  
  researchers.forEach((researcher, index) => {
    const researcherDocIndex = index + 1;
    
    let totalScore = 0;
    problemTerms.forEach(term => {
      const tfidfScore = tfidf.tfidf(term, researcherDocIndex);
      totalScore += tfidfScore;
    });
    
    rawScores.push({
      researcherId: researcher.id,
      rawScore: totalScore,
    });
    
    if (totalScore > maxScore) {
      maxScore = totalScore;
    }
  });
  
  rawScores.forEach(({ researcherId, rawScore }) => {
    const normalizedScore = maxScore > 0 
      ? Math.min(1, rawScore / maxScore)
      : 0.5;
    
    scores.push({
      researcherId,
      score: normalizedScore,
    });
  });
  
  scores.sort((a, b) => b.score - a.score);
  
  return scores.slice(0, topN);
}
