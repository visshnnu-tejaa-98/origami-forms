"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useUserStore } from "~/app/store/user-store";
import { useGetUser } from "~/hooks/use-user";
import Sidebar from "./components/Sidebar";
import { Icon } from "./components/icons";
import { useSidebarRail } from "~/hooks/use-sidebar-rail";
import "./shell.css";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const flush = pathname?.endsWith("/preview") ?? false;

  const { railed, closing, collapsed, toggleable, toggle } = useSidebarRail();

  const { isLoaded, isSignedIn, user } = useUser();
  const { createUserAsync } = useGetUser();
  const setUserToRedux = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!user?.id) return;

    createUserAsync({
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: user.imageUrl || undefined,
      clerkUserId: user.id,
    }).then((user) => {
      setUserToRedux({
        id: user.id,
        clerkId: user.clerkUserId,
        emailAddress: user.email!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        imageUrl: user.avatarUrl!,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <div
      className={`db-shell o-scope${flush ? " db-shell--flush" : ""}${railed ? " db-shell--rail" : ""}${closing ? " db-shell--closing" : ""}`}
    >
      <Sidebar />
      {toggleable && (
        <button
          type="button"
          className="sb-collapse"
          onClick={toggle}
          aria-pressed={collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name="chevron" size={14} />
        </button>
      )}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
