"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/scenarios", label: "Scenarios" },
  { href: "/admin/requests", label: "Suggestions" },
  { href: "/admin/tickets", label: "Support" },
  { href: "/admin/users", label: "Users" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-5 overflow-x-auto text-sm md:flex-col md:gap-1">
      {items.map((i) => {
        const on = i.href === "/admin" ? path === i.href : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`shrink-0 py-1.5 md:border-l-2 md:pl-3 ${
              on ? "border-accent font-semibold text-text" : "border-transparent text-muted hover:text-text"
            }`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
