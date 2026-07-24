"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useUserStore } from "~/app/store/user-store";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log({ user });
  const setUserToRedux = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) return
    if (!user) return

    if (!user?.id) return;

    setUserToRedux({
      clerkId: user!.id,
      emailAddress: user!.emailAddresses[0]?.emailAddress!,
      firstName: user!.firstName!,
      lastName: user!.lastName!,
      imageUrl: user!.imageUrl!,
    });
  }, [user])

  if (isLoaded && isSignedIn && user) {


  }

  return (
    <div>
      <div>Dashboard page</div>
      {user && (
        <div>
          <p>User: {user!.id}</p>
          <p>Email: {user!.emailAddresses[0]!.emailAddress}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
