"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useUserStore } from "~/app/store/user-store";
import { useGetUser } from "~/hooks/use-user";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { createUserAsync } = useGetUser();
  console.log({ user });
  const setUserToRedux = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!user) return;

    if (!user?.id) return;

    const userObj = {
      clerkId: user!.id,
      emailAddress: user!.emailAddresses[0]?.emailAddress!,
      firstName: user!.firstName!,
      lastName: user!.lastName!,
      imageUrl: user!.imageUrl!,
    };

    setUserToRedux(userObj);

    const createdUser = createUser();
    console.log({ createdUser });
  }, [user]);

  const createUser = async () => {
    console.log("debug flow", 777);
    return await createUserAsync({
      firstName: user!.firstName ?? undefined,
      lastName: user!.lastName ?? undefined,
      email: user!.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: user!.imageUrl || undefined,
      clerkUserId: user!.id,
    });
  };

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
