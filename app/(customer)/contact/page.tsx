"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ── Schema ──────────────────────────────────────────────────────
const contactSchema = z.object({
  firstName:   z.string().min(1, "First name is required"),
  lastName:    z.string().min(1, "Last name is required"),
  email:       z.email("Invalid email address"),
  phone:       z.string().min(7, "Please enter a valid phone number"),
  problem:     z.string().min(10, "Please describe your issue (min 10 characters)"),
});
type ContactSchema = z.infer<typeof contactSchema>;

// ── Info cards ───────────────────────────────────────────────────
const INFO_ITEMS = [
  {
    icon: MapPin,
    label: "Our Office",
    value: "123 Nguyen Hue Blvd",
    sub: "District 1, Ho Chi Minh City",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@roomie.vn",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+84 90 123 4567",
    sub: "Mon – Fri, 8 AM – 6 PM",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon – Fri",
    sub: "8:00 AM – 6:00 PM ICT",
  },
];

// ── Page ────────────────────────────────────────────────────────
export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchema>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (_data: ContactSchema) => {
    setLoading(true);
    // TODO: wire to API → authApi.contact(_data) or similar
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero banner ── */}
      <section className="bg-other-3 text-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Get in touch
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            We&apos;re here to help
          </h1>
          <p className="text-other-4/80 text-base leading-relaxed max-w-xl mx-auto">
            Have a question about a listing, need help with your account, or just want to say hello? Fill in the form and our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Info column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Contact information
              </h2>
              <p className="text-sm text-muted-foreground">
                Reach us through any of the channels below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {INFO_ITEMS.map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 transition-shadow hover:shadow-md cursor-default"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form column ── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
              {sent ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-xl font-bold">Message sent!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 rounded-full"
                    onClick={() => setSent(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                /* Form */
                <>
                  <div className="mb-6 space-y-1">
                    <h2 className="font-heading text-2xl font-bold tracking-tight">
                      Send us a message
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      All fields are required. We&apos;ll never share your information.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            id="firstName"
                            placeholder="John"
                            className="pl-9 h-10"
                            {...register("firstName")}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-xs text-destructive">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            className="pl-9 h-10"
                            {...register("lastName")}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-xs text-destructive">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9 h-10"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+84 90 123 4567"
                          className="pl-9 h-10"
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Problem */}
                    <div className="space-y-1.5">
                      <Label htmlFor="problem" className="text-sm font-medium">
                        Describe your issue
                      </Label>
                      <Textarea
                        id="problem"
                        placeholder="Tell us what you need help with — the more detail, the better we can assist you."
                        className="min-h-[130px] resize-none"
                        {...register("problem")}
                      />
                      {errors.problem && (
                        <p className="text-xs text-destructive">{errors.problem.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 font-semibold rounded-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" />Send message</>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
