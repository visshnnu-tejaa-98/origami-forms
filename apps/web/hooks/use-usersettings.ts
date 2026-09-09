import { useEffect, useState } from "react"
import { useUserStore, UserSettingsType } from "~/app/store/user-store";

type SettingsPayload = UserSettingsType;

export function useSettings() {
    const storedSettings = useUserStore((state) => state.settings);
    const [userSettings, setUserSettings] = useState<SettingsPayload>(storedSettings);

    useEffect(() => {
        setUserSettings(storedSettings);
    }, [storedSettings]);

    const updateUserSettings = <K extends keyof SettingsPayload>(
        key: K,
        value: SettingsPayload[K]
    ) => {
        setUserSettings((prev) => ({ ...prev, [key]: value }));
    };

    const resetUserSettings = () => setUserSettings(storedSettings);

    return {
        userSettings,
        updateUserSettings,
        resetUserSettings,
    };
}
