import { useEffect, useState } from "react"
import { ProfileDraft } from "~/app/(main)/settings/types";
import { useUserStore, UserSettingsType } from "~/app/store/user-store";

type SettingsPayload = UserSettingsType;

export function useSettings() {
    const storedUserDetails = useUserStore(state => state.user)
    const storedSettings = useUserStore((state) => state.settings);

    const [userProfile, setUserProfile] = useState<ProfileDraft>({
        role: "",
        email: "",
        firstName: "",
        lastName: "",
        avatarUrl: "",
    })
    const [userSettings, setUserSettings] = useState<SettingsPayload>(storedSettings);

    useEffect(() => {
        setUserProfile({
            role: storedUserDetails?.role || "",
            email: storedUserDetails?.emailAddress || "",
            firstName: storedUserDetails?.firstName || "",
            lastName: storedUserDetails?.lastName || "",
            avatarUrl: storedUserDetails?.imageUrl || "",
        })
    }, [storedUserDetails])

    useEffect(() => {
        setUserSettings(storedSettings);
    }, [storedSettings]);

    const updateUserProfile = (profile: ProfileDraft) => {
        setUserProfile(profile);
    };

    const updateUserSettings = <K extends keyof SettingsPayload>(
        key: K,
        value: SettingsPayload[K]
    ) => {
        setUserSettings((prev) => ({ ...prev, [key]: value }));
    };

    const resetUserSettings = () => setUserSettings(storedSettings);

    return {
        userProfile,
        userSettings,
        updateUserProfile,
        updateUserSettings,
        resetUserSettings,
    };
}
