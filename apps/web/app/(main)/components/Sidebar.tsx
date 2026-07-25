"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Icon, type IconName } from "./icons";

type NavItem = {
  href: string;
  icon: IconName;
  label: string;
  count?: string;
};

const workspace: NavItem[] = [
  { href: "/dashboard", icon: "home", label: "Overview" },
  { href: "/forms", icon: "forms", label: "My forms", count: "7" },
  { href: "/responses", icon: "mail", label: "Responses", count: "218" },
  { href: "/analytics", icon: "analytics", label: "Analytics" },
];

const library: NavItem[] = [
  { href: "/templates", icon: "templates", label: "Templates" },
  { href: "/themes", icon: "themes", label: "Themes" },
  { href: "/design-system", icon: "sparkles", label: "Design system" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();

  const firstName = user?.firstName ?? "there";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "you@origamiforms.com";
  const initial = (user?.firstName ?? "D").charAt(0).toUpperCase();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const renderItem = (item: NavItem) => (
    <Link
      key={item.href}
      className={`sb-item${isActive(item.href) ? " active" : ""}`}
      href={item.href}
    >
      <Icon name={item.icon} size={17} />
      <span>{item.label}</span>
      {item.count && <span className="count">{item.count}</span>}
    </Link>
  );

  return (
    <aside className="sidebar">
      <Link className="sb-brand" href="/">
        <span className="mark"><Icon name="crane" size={26} /></span>
        <span>origami</span>
      </Link>

      <Link className="sb-new" href="/builder">
        <Icon name="plus" size={16} />
        <span>New form</span>
      </Link>

      <div className="sb-section">Workspace</div>
      {workspace.map(renderItem)}

      <div className="sb-section">Library</div>
      {library.map(renderItem)}

      <div className="sb-section">Account</div>
      <Link className={`sb-item${isActive("/pricing") ? " active" : ""}`} href="/pricing">
        <Icon name="zap" size={17} /><span>Billing</span>
        <span className="o-badge o-badge--matcha" style={{ marginLeft: "auto", fontSize: "0.62rem", padding: "1px 6px" }}>free</span>
      </Link>
      <Link className={`sb-item${isActive("/settings") ? " active" : ""}`} href="/settings">
        <Icon name="settings" size={17} /><span>Settings</span>
      </Link>

      <div className="sb-user">
        <span className="o-avatar o-avatar--sm" style={{ background: "var(--sakura-soft)", color: "var(--sakura-deep)" }}>{initial}</span>
        <div>
          <div className="name">{firstName}</div>
          <div className="plan">{email}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
