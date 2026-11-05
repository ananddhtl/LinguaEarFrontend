import Link from "next/link";

import { Logo } from "./Logo";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#levels", label: "Levels" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hidden hover:text-text sm:block">
              {l.label}
            </Link>
          ))}
          <Link href="/#get-the-app" className="font-medium text-accent hover:underline">
            Get the app
          </Link>
        </nav>
      </div>
    </header>
  );
}
