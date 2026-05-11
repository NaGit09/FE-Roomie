"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, Search, BedDouble, Phone, Info,
  User, LogOut, Settings, ChevronDown, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";

const NAV_LINKS = [
  { href: "/",          label: "Home"     },
  { href: "/matching",  label: "Matching" },
  { href: "/rooms",     label: "Rooms"    },
  { href: "/contact",   label: "Contact"  },
  { href: "/about",     label: "About"    },
];

export default function CustomerHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div className="border-b border-other-4 bg-other-1/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/25 transition-transform duration-300 group-hover:rotate-6">
              <Home className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                Roomie
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
                Find your space
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-200
                    ${active
                      ? "text-primary"
                      : "text-other-2 hover:text-foreground"
                    }
                  `}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2.5 rounded-full border border-other-4 bg-white/60 pl-1.5 pr-3 py-1.5 hover:bg-white hover:border-primary/30 transition-all duration-200 cursor-pointer outline-none"
                    aria-label="User menu"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold select-none">
                      {initials}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-foreground max-w-[100px] truncate">
                      {user.firstName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuLabel className="font-normal py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {initials}
                      </div>
                      <div className="flex flex-col space-y-0.5 overflow-hidden">
                        <span className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer gap-2.5">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer gap-2.5">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer gap-2.5"
                    onClick={clearAuth}
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild size="sm" className="h-9 px-4 text-sm font-semibold rounded-full">
                  <Link href="/auth/login">Get started</Link>
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-other-4 bg-white/60 hover:bg-white transition-colors cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X className="h-4.5 w-4.5 text-foreground" />
                : <Menu className="h-4.5 w-4.5 text-foreground" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-b border-other-4 bg-other-1 px-4 py-3 space-y-0.5">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center h-10 px-3 rounded-lg text-sm font-semibold transition-colors
                  ${active
                    ? "bg-primary/10 text-primary"
                    : "text-other-2 hover:bg-other-1 hover:text-foreground"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-other-4 flex gap-2">
              <Button asChild size="sm" className="flex-1 h-9 rounded-full text-sm font-semibold">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Get started</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}