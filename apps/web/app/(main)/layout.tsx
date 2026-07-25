"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useUserStore } from "~/app/store/user-store";
import { useGetUser } from "~/hooks/use-user";
import Sidebar from "./components/Sidebar";
import "./shell.css";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { createUserAsync } = useGetUser();
  const setUserToRedux = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!user?.id) return;

    setUserToRedux({
      clerkId: user.id,
      emailAddress: user.emailAddresses[0]?.emailAddress!,
      firstName: user.firstName!,
      lastName: user.lastName!,
      imageUrl: user.imageUrl!,
    });

    createUserAsync({
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: user.imageUrl || undefined,
      clerkUserId: user.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <div className="db-shell o-scope">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
