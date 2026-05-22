"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home, User, LogOut, Settings, ChevronDown, Menu, X,
  Building2, Heart, ShieldCheck
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
  { href: "/",          label: "Trang chủ"  },
  { href: "/matching",  label: "Tìm bạn" },
  { href: "/rooms",     label: "Phòng trọ"  },
  { href: "/contact",   label: "Liên hệ"  },
  { href: "/about",     label: "Giới thiệu" },
];

export default function CustomerHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Generate initials cleanly from user's full_name
  const initials = user && user.full_name
    ? user.full_name
        .trim()
        .split(/\s+/)
        .map((n: string) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
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
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-black select-none">
                      {initials}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[110px] truncate">
                      {user.full_name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 mt-1.5 rounded-[1.5rem] border-slate-100 p-2 shadow-xl">
                  
                  {/* Custom Header Info */}
                  <DropdownMenuLabel className="font-normal py-2 px-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-black">
                        {initials}
                      </div>
                      <div className="flex flex-col space-y-0.5 overflow-hidden">
                        <span className="text-sm font-extrabold text-slate-800 truncate">
                          {user.full_name}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 truncate">
                          {user.email}
                        </span>
                        
                        {/* Beautiful Adaptive Role Badge */}
                        <span className={`
                          mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider
                          ${user.role === "LANDLORD" 
                            ? "bg-amber-100 text-amber-700" 
                            : user.role === "ADMIN" 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                          }
                        `}>
                          {user.role === "LANDLORD" 
                            ? "Chủ nhà" 
                            : user.role === "ADMIN" 
                            ? "Quản trị" 
                            : "Người thuê"
                          }
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                    <Link href="/user/profile" className="gap-2.5">
                      <User className="h-4 w-4 text-slate-400" />
                      Quản lý tài khoản
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                    <Link href="/user/setting" className="gap-2.5">
                      <Settings className="h-4 w-4 text-slate-400" />
                      Cài đặt tài khoản
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-700 rounded-xl px-3 py-2 cursor-pointer gap-2.5 focus:bg-red-50/50"
                    onClick={clearAuth}
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    Đăng xuất tài khoản
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild size="sm" className="h-9 px-4.5 text-xs font-black tracking-widest uppercase rounded-full bg-primary hover:bg-primary/95 text-white cursor-pointer shadow-md shadow-primary/10 hover:scale-[1.02] transition-all">
                  <Link href="/auth/login">Đăng nhập</Link>
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
              <Button asChild size="sm" className="flex-1 h-9 rounded-full text-xs font-black tracking-wider uppercase bg-primary text-white">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}