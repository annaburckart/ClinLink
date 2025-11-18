import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/generated_images/Medical_research_collaboration_hero_b17ca772.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div 
        className="relative h-[60vh] md:h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Connect Clinical Challenges with Research Expertise
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Submit your healthcare challenge and discover leading researchers who can help drive evidence-based solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit-problem">
              <Button 
                size="lg" 
                className="w-full sm:w-auto backdrop-blur-md bg-primary/90 hover:bg-primary border border-primary-border"
                data-testid="button-submit-hero"
              >
                Submit a Problem
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/researchers">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto backdrop-blur-md bg-background/10 hover:bg-background/20 text-white border-white/30"
                data-testid="button-browse-hero"
              >
                Browse Researchers
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to connect your clinical challenge with the right research expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-card-border" data-testid="card-step-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">1. Describe Your Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Submit a detailed description of your clinical problem or research question
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-card-border" data-testid="card-step-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">2. AI-Powered Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Our algorithm analyzes your problem against researcher profiles and expertise
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-card-border" data-testid="card-step-3">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">3. Connect with Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Review ranked matches and connect with researchers best suited to help
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ClinLink?</h2>
            <p className="text-lg text-muted-foreground">
              Accelerate evidence-based healthcare through expert collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Precise Matching", description: "Advanced algorithms match your specific challenge with relevant research expertise" },
              { title: "Save Time", description: "Find the right experts quickly instead of searching through countless profiles" },
              { title: "Evidence-Based", description: "Connect with researchers who have proven track records in relevant areas" },
              { title: "Collaborative Solutions", description: "Bridge the gap between clinical practice and cutting-edge research" }
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4" data-testid={`benefit-${index}`}>
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Submit your clinical challenge today and discover the research expertise that can help you find solutions
          </p>
          <Link href="/submit-problem">
            <Button size="lg" data-testid="button-submit-cta">
              Submit Your Problem
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
