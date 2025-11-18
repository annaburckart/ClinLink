import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Users, History, Home } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/submit-problem", label: "Submit Problem", icon: FileText },
    { href: "/researchers", label: "Researchers", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">CL</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">ClinLink</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
