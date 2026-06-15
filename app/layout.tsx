import type { Metadata } from "next";
import { Inter, Josefin_Sans, Cinzel, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthHydration } from "@/components/custom/auth/AuthHydration";
import { Toaster } from "sonner";

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Roomie — Find Your Perfect Space",
    template: "%s | Roomie",
  },
  description:
    "Discover premium rental rooms tailored to your lifestyle, with all the comforts of home.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        josefinSans.variable,
        inter.variable,
        cinzel.variable,
        playfairDisplay.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <AuthHydration />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
