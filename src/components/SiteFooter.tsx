import Link from "next/link";

const legal = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/impressum", label: "Impressum" },
  { href: "/admin/login", label: "Admin" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© LinguaEar. Train your ear for real conversations.</p>
        <nav className="flex gap-5">
          {legal.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-text">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
