import Link from "next/link";
import {
  Home, Users, Target, Heart, Shield, Star,
  ArrowRight, Building2, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Data ────────────────────────────────────────────────────────
const STATS = [
  { value: "10,000+", label: "Happy Renters" },
  { value: "3,500+",  label: "Verified Rooms" },
  { value: "120+",    label: "Cities Covered" },
  { value: "98%",     label: "Satisfaction Rate" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Every listing is manually verified. We run background checks on landlords and provide secure in-app communication so you never have to share personal contacts.",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "We believe finding a home should feel human. Our matching algorithm considers lifestyle, habits, and personality — not just budget and location.",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description:
      "Our smart matching engine learns your preferences and surfaces the rooms most likely to feel like home — reducing the average search time by 60%.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description:
      "We partner only with landlords who meet our quality standards. Every room on Roomie has been inspected, photographed, and fact-checked.",
  },
];

const TEAM = [
  {
    name: "An Nguyen",
    role: "Co-founder & CEO",
    initials: "AN",
    bio: "Former product lead at a top-10 PropTech startup. Passionate about making housing more accessible for everyone.",
  },
  {
    name: "Linh Tran",
    role: "Co-founder & CTO",
    initials: "LT",
    bio: "Full-stack engineer with 8 years of experience building scalable platforms. Obsessed with developer experience and clean code.",
  },
  {
    name: "Minh Pham",
    role: "Head of Design",
    initials: "MP",
    bio: "Previously at a leading design agency. Believes great design should be invisible — you just feel it.",
  },
  {
    name: "Thu Le",
    role: "Head of Operations",
    initials: "TL",
    bio: "Built and scaled operations teams at two unicorn startups. Keeps the trains running — and on time.",
  },
];

const MILESTONES = [
  { year: "2021", event: "Roomie founded in a small co-working space in District 1." },
  { year: "2022", event: "Reached 500 verified listings and 2,000 active users in Ho Chi Minh City." },
  { year: "2023", event: "Expanded to Hanoi and Da Nang. Launched our smart matching engine." },
  { year: "2024", event: "Surpassed 10,000 happy renters. Raised our Series A funding round." },
  { year: "2025", event: "Expanding across Southeast Asia. 120+ cities, one home at a time." },
];

// ── Page ────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="bg-other-3 text-white py-20 px-4 relative overflow-hidden">
        {/* decorative ring */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-48 -left-24 h-96 w-96 rounded-full border border-white/5" />

        <div className="relative mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Building2 className="h-3.5 w-3.5" />
            Our story
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            We help people find a<br />
            <span className="text-primary italic">place to call home.</span>
          </h1>
          <p className="text-other-4/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Roomie was built on a simple belief: finding a great rental room shouldn&apos;t be stressful, unsafe, or time-consuming. We&apos;re here to change that.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-border/50 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center space-y-1">
                <p className="font-heading text-4xl font-bold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Our mission</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Matching people with spaces they&apos;ll love to live in.
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We started Roomie because we&apos;ve all been there — scrolling through listings at midnight, visiting rooms that look nothing like the photos, dealing with unresponsive landlords. It&apos;s exhausting.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              So we built something better. A platform where every listing is verified, every landlord is accountable, and every renter is treated with respect. From your first search to signing your lease — we&apos;re with you every step of the way.
            </p>
            <ul className="space-y-2.5">
              {[
                "100% verified listings — no fakes, no surprises",
                "Smart matching based on lifestyle, not just location",
                "Secure in-app messaging — no personal data shared",
                "Transparent pricing — what you see is what you pay",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: stacked cards */}
          <div className="relative flex justify-center">
            <div className="absolute top-4 left-8 right-8 h-full rounded-2xl bg-primary/5 border border-primary/10" />
            <div className="absolute top-2 left-4 right-4 h-full rounded-2xl bg-primary/8 border border-primary/10" />
            <div className="relative w-full rounded-2xl border border-border/60 bg-card p-8 shadow-lg space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/25">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">Roomie</p>
                  <p className="text-xs text-muted-foreground">Your trusted rental platform</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Listings verified", pct: 100 },
                  { label: "Avg. match rate", pct: 94 },
                  { label: "Renter satisfaction", pct: 98 },
                ].map(({ label, pct }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">
                Data based on platform analytics — Q1 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-card border-y border-border/50 py-20 px-4">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">What drives us</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Our core values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border/50 bg-background p-6 space-y-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">How we got here</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Our journey</h2>
        </div>
        <div className="relative max-w-2xl mx-auto">
          {/* vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {MILESTONES.map(({ year, event }) => (
              <div key={year} className="relative flex items-start gap-6 pl-10">
                {/* dot */}
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background shrink-0">
                  <span className="text-[10px] font-bold text-primary">{year.slice(2)}</span>
                </div>
                <div className="pt-1.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">{year}</p>
                  <p className="text-sm text-foreground leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-card border-y border-border/50 py-20 px-4">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">The people behind it</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Meet the team</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              We&apos;re a small, passionate team united by the belief that everyone deserves a great place to live.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, initials, bio }) => (
              <div
                key={name}
                className="rounded-xl border border-border/50 bg-background p-6 space-y-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-default text-center"
              >
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-xl font-bold shadow-md shadow-primary/20">
                    {initials}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-heading font-semibold text-foreground">{name}</h3>
                  <p className="text-xs font-medium text-primary uppercase tracking-wide">{role}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-other-3 text-white py-20 px-4">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30">
              <Home className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to find your space?
            </h2>
            <p className="text-other-4/80 text-base leading-relaxed">
              Join thousands of renters who found their perfect home through Roomie. It only takes a few minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 font-semibold">
              <Link href="/customer/rooms">
                Browse rooms <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Link href="/customer/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}