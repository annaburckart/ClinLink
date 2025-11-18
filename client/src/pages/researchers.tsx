import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Building2, UserPlus, Users } from "lucide-react";
import type { Researcher } from "@shared/schema";

function ResearcherDirectoryCard({ researcher }: { researcher: Researcher }) {
  const initials = researcher.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border-card-border hover-elevate h-full" data-testid={`card-researcher-${researcher.id}`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 break-words" data-testid={`text-researcher-name-${researcher.id}`}>
              {researcher.name}
            </CardTitle>
            {researcher.institution && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{researcher.institution}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>Capacity: {researcher.capacity} {researcher.capacity === 1 ? 'project' : 'projects'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Research Areas</h4>
          <div className="flex flex-wrap gap-2">
            {researcher.keywords.slice(0, 4).map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="rounded-full px-3 py-1">
                {keyword}
              </Badge>
            ))}
            {researcher.keywords.length > 4 && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                +{researcher.keywords.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <CardDescription className="text-sm line-clamp-3">
          {researcher.description}
        </CardDescription>

        <Button variant="outline" className="w-full" asChild data-testid={`button-contact-${researcher.id}`}>
          <a href={`mailto:${researcher.email}`}>
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Researchers() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: researchers, isLoading } = useQuery<Researcher[]>({
    queryKey: ["/api/researchers"],
  });

  const filteredResearchers = researchers?.filter(researcher => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      researcher.name.toLowerCase().includes(search) ||
      researcher.description.toLowerCase().includes(search) ||
      researcher.keywords.some(k => k.toLowerCase().includes(search)) ||
      researcher.institution?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Research Directory</h1>
            <p className="text-lg text-muted-foreground">
              Browse our network of researchers and their areas of expertise
            </p>
          </div>
          <Link href="/register-researcher">
            <Button size="lg" className="gap-2" data-testid="button-register-researcher">
              <UserPlus className="h-4 w-4" />
              Register as Researcher
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, institution, or research area..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-researchers"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-card-border">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResearchers && filteredResearchers.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredResearchers.length} researcher{filteredResearchers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResearchers.map((researcher) => (
                <ResearcherDirectoryCard key={researcher.id} researcher={researcher} />
              ))}
            </div>
          </>
        ) : (
          <Card className="border-card-border">
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground">
                {searchTerm ? "No researchers found matching your search." : "No researchers available yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
