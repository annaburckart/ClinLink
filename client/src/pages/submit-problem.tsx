import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, X, Plus } from "lucide-react";
import { insertClinicianProblemSchema, type InsertClinicianProblem } from "@shared/schema";
import type { ProblemWithMatches } from "@shared/schema";
import { z } from "zod";

const formSchema = insertClinicianProblemSchema.extend({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  domain: z.string().trim().min(1, "Domain is required"),
  keywords: z.array(z.string().trim().min(1)).min(1, "Please add at least one keyword"),
});

export default function SubmitProblem() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<InsertClinicianProblem>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      keywords: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertClinicianProblem) => {
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

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      const newKeywords = [...keywords, trimmed];
      setKeywords(newKeywords);
      form.setValue("keywords", newKeywords);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const onSubmit = (data: InsertClinicianProblem) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit Your Clinical Challenge</h1>
          <p className="text-lg text-muted-foreground">
            Describe your healthcare problem in detail to find researchers with relevant expertise
          </p>
        </div>

        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
            <CardDescription>
              Provide comprehensive information about your clinical challenge for better matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief title for your clinical challenge"
                          data-testid="input-problem-title"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A concise summary of your problem (e.g., "Reducing post-operative infections in cardiac surgery")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area of Study / Domain</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Cardiology, Oncology, Infectious Diseases"
                          data-testid="input-problem-domain"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The medical specialty or field related to this problem
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter a keyword and press Enter"
                              value={keywordInput}
                              onChange={(e) => setKeywordInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              data-testid="input-problem-keyword"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleAddKeyword}
                              data-testid="button-add-problem-keyword"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {keywords.map((keyword, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="rounded-full px-3 py-1"
                                  data-testid={`badge-problem-keyword-${index}`}
                                >
                                  {keyword}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(keyword)}
                                    className="ml-2 hover:text-destructive"
                                    data-testid={`button-remove-problem-keyword-${index}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add keywords that describe your problem (e.g., patient adherence, telemedicine, readmission)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a comprehensive description of your clinical challenge, including context, current approaches, and what kind of research expertise you're seeking..."
                          className="min-h-48 resize-none text-base"
                          data-testid="input-problem-description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific for better results (minimum 20 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={submitMutation.isPending}
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
