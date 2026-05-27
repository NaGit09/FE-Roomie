import Image from "next/image";
import Link from "next/link";
import { Home, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/custom/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary/20">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-muted">
        <Image
          src="/rental-room-bg.png"
          alt="Cozy rental room"
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-12 left-12 z-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/30">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tighter drop-shadow-md">
              Roomie
            </span>
          </Link>
        </div>

        <div className="absolute z-10 text-white p-16 text-left max-w-xl bottom-0">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/20 text-primary-foreground border border-primary/20 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Premium Spaces for You
          </div>
          <h1 className="text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
            Find your <br />
            <span className="text-primary italic">perfect</span> space.
          </h1>
          <p className="text-xl text-zinc-300 max-w-md leading-relaxed">
            Discover premium rental rooms tailored to your lifestyle, with all
            the comforts of home and the convenience of modern living.
          </p>
        </div>
      </div>

      {/* Right side - Login Form Wrapper */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(193,68,14,0.03),transparent)] pointer-events-none" />
        <div className="w-full max-w-100 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          <div className="flex flex-col space-y-2 mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-lg shadow-md shadow-primary/20">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tighter">
                Roomie
              </span>
            </Link>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
