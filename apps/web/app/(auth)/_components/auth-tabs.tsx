"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Sign up" },
  // { href: "/forgot", label: "Forgot" },
] as const;

export function AuthTabs() {
  const pathname = usePathname();

  return (
    <nav className="auth-tabs" aria-label="Authentication">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
