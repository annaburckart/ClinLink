import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Mail, Building2, Award, Users } from "lucide-react";
import type { ProblemWithMatches } from "@shared/schema";

function MatchScoreBadge({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  let variant: "default" | "secondary" | "outline" = "secondary";
  let label = "Moderate Match";

  if (percentage >= 90) {
    variant = "default";
    label = "High Match";
  } else if (percentage >= 70) {
    variant = "default";
    label = "Good Match";
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} className="text-sm font-semibold" data-testid={`badge-match-score-${percentage}`}>
        {percentage}% {label}
      </Badge>
    </div>
  );
}

function ResearcherCard({ researcher, score, rank }: { researcher: any; score: number; rank: number }) {
  return (
    <Card className="border-card-border hover-elevate" data-testid={`card-researcher-${researcher.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
            </div>
            <CardTitle className="text-xl mb-2 break-words" data-testid={`text-researcher-name-${researcher.id}`}>
              {researcher.name}
            </CardTitle>
            {researcher.institution && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{researcher.institution}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>Capacity: {researcher.capacity} {researcher.capacity === 1 ? 'project' : 'projects'}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <MatchScoreBadge score={score} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Research Areas</h4>
          <div className="flex flex-wrap gap-2">
            {researcher.keywords.map((keyword: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="rounded-full px-3 py-1" data-testid={`badge-keyword-${idx}`}>
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {researcher.description}
          </p>
        </div>

        <Button variant="default" className="w-full" asChild data-testid={`button-contact-${researcher.id}`}>
          <a href={`mailto:${researcher.email}`}>
            <Mail className="mr-2 h-4 w-4" />
            Contact Researcher
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function MatchResults() {
  const [, params] = useRoute("/matches/:id");
  const problemId = params?.id;

  const { data, isLoading, error } = useQuery<ProblemWithMatches>({
    queryKey: ["/api/matches", problemId],
    enabled: !!problemId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <Card className="mb-8 border-card-border">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-card-border">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Match Results Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The requested match results could not be found.
          </p>
          <Link href="/submit-problem">
            <Button data-testid="button-submit-new">Submit a New Problem</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="mb-8 border-card-border">
          <CardHeader>
            <CardTitle className="text-2xl mb-2" data-testid="text-problem-title">
              {data.problem.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {data.problem.domain}
              </Badge>
              {data.problem.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="rounded-full px-3 py-1">
                  {keyword}
                </Badge>
              ))}
            </div>
            <CardDescription className="text-base leading-relaxed" data-testid="text-problem-description">
              {data.problem.description}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Matching Researchers ({data.matches.length})
          </h2>
          <p className="text-muted-foreground">
            Ranked by relevance to your clinical challenge
          </p>
        </div>

        {data.matches.length === 0 ? (
          <Card className="border-card-border">
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                No matching researchers found for this problem.
              </p>
              <Link href="/submit-problem">
                <Button data-testid="button-submit-another">
                  Submit Another Problem
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.matches.map((match, index) => (
              <ResearcherCard
                key={match.researcher.id}
                researcher={match.researcher}
                score={match.score}
                rank={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
