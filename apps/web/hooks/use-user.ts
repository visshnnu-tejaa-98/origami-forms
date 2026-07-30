"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { trpc } from "~/trpc/client";

export function useCurrentUser() {
    const { user, isLoaded, isSignedIn } = useUser();

    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatarUrl: "",
        role: "",
        clerkId: "",
    });

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setUserDetails({
                clerkId: user.id,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.emailAddresses?.[0]?.emailAddress || "",
                avatarUrl: user.imageUrl || "",
                role: (user.publicMetadata?.role as string) || "",
            });
        }
    }, [user, isLoaded, isSignedIn]);

    return { user: userDetails, isSignedIn, isLoaded };
}

export function useGetUser() {
    const {
        mutateAsync: createUserAsync,
        mutate: createUser,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.auth.createUser.useMutation();
    return {
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
        createUserAsync,
        createUser,
    };
}