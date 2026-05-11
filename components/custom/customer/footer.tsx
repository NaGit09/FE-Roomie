import Link from "next/link";
import {
  Home, BedDouble, Search, Phone, Info,
  MapPin, Mail,
} from "lucide-react";

const FOOTER_NAV = [
  {
    heading: "Explore",
    links: [
      { href: "/customer/rooms",    label: "Browse Rooms" },
      { href: "/customer/matching", label: "Smart Matching" },
      { href: "/customer/home",     label: "Home" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/customer/about",   label: "About Us" },
      { href: "/customer/contact", label: "Contact" },
      { href: "/blog",             label: "Blog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/terms",   label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
];

const SOCIALS = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "X (Twitter)",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function CustomerFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-other-4 bg-other-3 text-other-4">
      {/* Top band */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

        {/* Brand column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Link href="/customer/home" className="flex items-center gap-3 group w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:rotate-6">
              <Home className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-lg font-bold tracking-tight text-white">Roomie</span>
              <span className="text-[10px] font-medium text-other-2 tracking-widest uppercase">Find your space</span>
            </div>
          </Link>

          <p className="text-sm leading-relaxed text-other-2 max-w-xs">
            Discover premium rental rooms tailored to your lifestyle — from cozy studios to spacious shared apartments across the city.
          </p>

          {/* Contact blurb */}
          <div className="space-y-2 text-xs text-other-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>123 Nguyen Hue, Ho Chi Minh City</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <a href="mailto:hello@roomie.vn" className="hover:text-white transition-colors">hello@roomie.vn</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
              <a href="tel:+84901234567" className="hover:text-white transition-colors">+84 90 123 4567</a>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            {SOCIALS.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-other-2/40 text-other-2 hover:border-primary hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_NAV.map(({ heading, links }) => (
          <div key={heading} className="flex flex-col gap-3">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              {heading}
            </h3>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-other-2 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-other-2">
          <span>&copy; {year} Roomie. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms"   className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}