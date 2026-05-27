import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 selection:bg-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(193,68,14,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-105 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 border border-border/40">
            <SearchX className="h-9 w-9 text-muted-foreground" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">404 Not Found</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We couldn&apos;t find what you were looking for. The page may have been moved, deleted, or doesn&apos;t exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="h-10 px-6 font-medium">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-10 px-6 font-medium">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>

        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <div className="bg-primary p-1 rounded-md">
            <Home className="h-3 w-3 text-white" />
          </div>
          Roomie
        </Link>
      </div>
    </div>
  );
}
