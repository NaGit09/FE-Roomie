import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthHydration } from "@/components/custom/auth/AuthHydration";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
      className={cn("h-full antialiased", inter.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <AuthHydration />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
