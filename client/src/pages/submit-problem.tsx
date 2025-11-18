import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ChevronDown, Lightbulb } from "lucide-react";
import type { ProblemWithMatches } from "@shared/schema";

export default function SubmitProblem() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [examplesOpen, setExamplesOpen] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: { description: string }) => {
      const response = await apiRequest("POST", "/api/clinician-problems", data);
      return await response.json() as ProblemWithMatches;
    },
    onSuccess: (data) => {
      toast({
        title: "Problem submitted successfully",
        description: `Found ${data.matches.length} matching researchers`,
      });
      setLocation(`/matches/${data.problem.id}`);
    },
    onError: (error: Error) => {
      console.error("Submission error:", error);
      toast({
        title: "Error submitting problem",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      toast({
        title: "Description too short",
        description: "Please provide at least 20 characters",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({ description: description.trim() });
  };

  const exampleProblems = [
    "We're seeing an increase in antibiotic-resistant infections in post-operative cardiac patients. Need research on alternative prophylactic strategies.",
    "Looking for evidence-based interventions to reduce readmission rates for heart failure patients within 30 days of discharge.",
    "Seeking research on telemedicine approaches for managing chronic pain in rural populations with limited healthcare access."
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit Your Clinical Challenge</h1>
          <p className="text-lg text-muted-foreground">
            Describe your healthcare problem in detail to find researchers with relevant expertise
          </p>
        </div>

        <Card className="mb-6 border-card-border">
          <CardHeader>
            <CardTitle>Problem Description</CardTitle>
            <CardDescription>
              Provide a comprehensive description of your clinical challenge for better matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Describe your clinical challenge in detail
                </Label>
                <Textarea
                  id="description"
                  placeholder="Example: We are experiencing challenges with patient adherence to medication regimens for chronic conditions..."
                  className="min-h-48 resize-none text-base"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="input-problem-description"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {description.length} characters (minimum 20)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Be specific for better results
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full md:w-auto"
                disabled={submitMutation.isPending || description.trim().length < 20}
                data-testid="button-submit-problem"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  "Find Matching Researchers"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Collapsible open={examplesOpen} onOpenChange={setExamplesOpen}>
          <Card className="border-card-border">
            <CollapsibleTrigger className="w-full" data-testid="button-toggle-examples">
              <CardHeader className="cursor-pointer hover-elevate active-elevate-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Example Problems</CardTitle>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform ${examplesOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                <CardDescription className="text-left">
                  See examples of well-described clinical challenges
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {exampleProblems.map((example, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-muted/30 rounded-md cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => setDescription(example)}
                    data-testid={`example-problem-${index}`}
                  >
                    <p className="text-sm">{example}</p>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
