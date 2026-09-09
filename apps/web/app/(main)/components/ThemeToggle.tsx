"use client";

import { DARK, LIGHT } from "@repo/database/constants";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { useUserStore } from "~/app/store/user-store";
import { useUpdateUserSettings } from "~/hooks/use-user";
import { Icon } from "./icons";

const ThemeToggle = () => {
    const { setTheme } = useTheme();
    const theme = useUserStore((state) => state.settings.theme);
    const commitSettings = useUserStore((state) => state.updateSettings);
    const { updateUserSettings } = useUpdateUserSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = theme === DARK;

    const flip = () => {
        const next = isDark ? LIGHT : DARK;
        setTheme(next);
        commitSettings({ theme: next });
        updateUserSettings({ theme: next });
    };

    return (
        <button
            type="button"
            className={`sb-theme${mounted && isDark ? " on" : ""}`}
            onClick={flip}
            role="switch"
            aria-checked={mounted ? isDark : false}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Ink · tap for paper" : "Paper · tap for ink"}
            suppressHydrationWarning
        >
            <span className="sb-theme__track" aria-hidden="true">
                <span className="sb-theme__side sb-theme__side--sun"><Icon name="sun" size={16} /></span>
                <span className="sb-theme__side sb-theme__side--moon"><Icon name="moon" size={16} /></span>
                <span className="sb-theme__knob" />
            </span>
        </button>
    );
};

export default ThemeToggle;
