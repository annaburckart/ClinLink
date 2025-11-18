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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, X, Plus } from "lucide-react";
import { insertResearcherSchema, type InsertResearcher } from "@shared/schema";
import { z } from "zod";

const formSchema = insertResearcherSchema.extend({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  keywords: z.array(z.string().trim().min(1)).min(1, "Please add at least one research area keyword"),
  capacity: z.number().int().min(1, "Capacity must be at least 1").max(20, "Capacity cannot exceed 20"),
});

export default function RegisterResearcher() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<InsertResearcher>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      description: "",
      keywords: [],
      capacity: 1,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertResearcher) => {
      const response = await apiRequest("POST", "/api/researchers", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "Your researcher profile has been added to the directory",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/researchers"] });
      setLocation("/researchers");
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
      toast({
        title: "Error registering profile",
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

  const onSubmit = (data: InsertResearcher) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Register as a Researcher</h1>
          <p className="text-lg text-muted-foreground">
            Join our network of researchers and help clinicians find solutions to their challenges
          </p>
        </div>

        <Card className="border-card-border">
          <CardHeader>
            <CardTitle>Researcher Profile</CardTitle>
            <CardDescription>
              Fill out your information to be added to the research directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dr. Jane Smith"
                          data-testid="input-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane.smith@university.edu"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University Medical Center"
                          data-testid="input-institution"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Research Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          placeholder="3"
                          data-testid="input-capacity"
                          {...field}
                          value={field.value ?? 1}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        How many research projects can you take on? (1-20)
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
                      <FormLabel>Research Areas</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter a keyword and press Enter"
                              value={keywordInput}
                              onChange={(e) => setKeywordInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              data-testid="input-keyword"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleAddKeyword}
                              data-testid="button-add-keyword"
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
                                  data-testid={`badge-keyword-${index}`}
                                >
                                  {keyword}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(keyword)}
                                    className="ml-2 hover:text-destructive"
                                    data-testid={`button-remove-keyword-${index}`}
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
                        Add keywords that describe your research areas (e.g., cardiology, oncology, AI)
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
                      <FormLabel>Research Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your research focus, expertise, and areas of interest..."
                          className="min-h-32 resize-none text-base"
                          data-testid="input-description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about your research to help clinicians find you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto"
                  disabled={registerMutation.isPending}
                  data-testid="button-submit-registration"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register as Researcher"
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
