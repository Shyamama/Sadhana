import "@/styles/globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sādhanā",
  description: "Web-first PWA for daily sādhanā, guidance, and reflection.",
  manifest: "/manifest.webmanifest"
};

const navItems = [
  { href: "/", label: "Ask" },
  { href: "/practice", label: "Practice" },
  { href: "/journal", label: "Journal" },
  { href: "/sources", label: "Sources" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-paper">
          <header className="border-b border-amber-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Sādhanā</p>
                <h1 className="text-2xl font-semibold">Pandit Mode Prototype</h1>
              </div>
              <nav className="flex flex-wrap gap-2 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-amber-200 px-4 py-1 transition hover:bg-amber-50"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/onboarding"
                  className="rounded-full bg-amber-700 px-4 py-1 text-white hover:bg-amber-800"
                >
                  Choose Tier
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
          <footer className="border-t border-amber-100 bg-white/70">
            <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-amber-900">
              <p>
                Demo build. Answers are grounded in local sources and include citations. This is not spiritual
                direction or professional advice.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
