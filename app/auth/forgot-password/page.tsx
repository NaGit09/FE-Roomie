import Link from "next/link";
import { Home } from "lucide-react";
import { ForgotPasswordForm } from "@/components/custom/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12 selection:bg-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(193,68,14,0.05),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-95 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="bg-primary p-1.5 rounded-lg shadow-md shadow-primary/20">
            <Home className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Roomie
          </span>
        </Link>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
