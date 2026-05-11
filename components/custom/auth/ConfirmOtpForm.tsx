"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export function ConfirmOtpForm() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < OTP_LENGTH) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push("/auth/change-password");
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <KeyRound className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Enter your code</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We sent a 6-digit verification code to your email. Check your inbox and enter the code below.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* OTP Boxes */}
        <div className="flex gap-2.5 justify-between" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                h-12 w-full text-center text-lg font-semibold rounded-lg border bg-muted/20
                transition-all duration-150 outline-none
                focus:border-primary focus:ring-2 focus:ring-primary/20
                ${error ? "border-destructive" : "border-border/40"}
              `}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…</>
          ) : (
            "Verify code"
          )}
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/auth/forgot-password"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <button
          type="button"
          className="text-primary hover:underline underline-offset-4 font-medium"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
