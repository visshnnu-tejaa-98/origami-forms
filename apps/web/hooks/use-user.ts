"use client";

import { useUser } from "@clerk/nextjs";
import { GetUserSettingsByUserInputPropsType } from "@repo/services/user/model";
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

export function useUserSettings() {
    const {
        data: userSettingsData,
        error: userSettingsError,
        failureCount: userSettingsFailureCount,
        isError: userSettingsIsError,
        isSuccess: userSettingsIsSuccess,
        isPending: userSettingsIsPending,
        status: userSettingsStatus,
    } = trpc.auth.getUserSettings.useQuery({});

    return {
        userSettingsData,
        userSettingsError,
        userSettingsFailureCount,
        userSettingsIsError,
        userSettingsIsSuccess,
        userSettingsIsPending,
        userSettingsStatus,
    };
}

export function useUpdateUserSettings() {
    const {
        mutateAsync: updateUserSettingsAsync,
        mutate: updateUserSettings,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.auth.updateUserSettings.useMutation();
    return {
        updateUserSettingsAsync,
        updateUserSettings,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    };
}