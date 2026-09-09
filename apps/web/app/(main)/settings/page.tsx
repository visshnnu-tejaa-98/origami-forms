"use client";

import React, { useEffect, useState } from "react";
import "./settings.css";
import { Icon } from "../components/icons";
import ConfirmDialog from "../components/ConfirmDialog";
import SettingsNav from "./components/SettingsNav";
import SettingsDecorations from "./components/SettingsDecorations";
import ProfilePanel from "./components/ProfilePanel";
import AppearancePanel from "./components/AppearancePanel";
import PreferencesPanel from "./components/PreferencesPanel";
import DangerPanel from "./components/DangerPanel";
import { PreferencesDraft, ProfileDraft, Role, SettingsSection, ThemeChoice, ViewChoice } from "./types";
import { useSettings } from "~/hooks/use-usersettings";
import { useUserStore } from "~/app/store/user-store";
import { useUpdateUserSettings } from "~/hooks/use-user";
import { useTheme } from "next-themes";

const VIEWER = {
    email: "aiko@origami.dev",
    role: "admin" as Role,
};

const Settings = () => {
    const { userSettings, updateUserSettings } = useSettings();
    const commitSettings = useUserStore((state) => state.updateSettings);
    const userSettingsFromRedux = useUserStore(state => state.settings)
    const { updateUserSettings: saveUserSettings } = useUpdateUserSettings();
    const { setTheme } = useTheme();

    const [section, setSection] = useState<SettingsSection>("profile");
    const [dirty, setDirty] = useState(false);

    const [profile, setProfile] = useState<ProfileDraft>({
        firstName: "Aiko",
        lastName: "Tanaka",
        avatarUrl: "",
    });

    const { theme, view } = userSettings;
    const [prefs, setPrefs] = useState<PreferencesDraft>({
        formsPerPage: userSettingsFromRedux?.formsPerPage || 10,
        responsesPerPage: userSettingsFromRedux?.responsesPerPage || 10,
    });

    const [deleteAccount, setDeleteAccount] = useState(false);

    const isAdmin = VIEWER.role === "admin";

    const handlePreferenceChange =
        <T extends PreferencesDraft>(setter: React.Dispatch<React.SetStateAction<T>>) =>
            (patch: Partial<T>) => {
                setter((prev) => ({ ...prev, ...patch }));
                setDirty(true);

                if (patch.hasOwnProperty("formsPerPage")) {
                    updateUserSettings("formsPerPage", Number(patch.formsPerPage));
                }

                if (patch.hasOwnProperty("responsesPerPage")) {
                    updateUserSettings("responsesPerPage", Number(patch.responsesPerPage));
                }
            };

    const handleThemeChange = (theme: ThemeChoice) => {
        updateUserSettings("theme", theme);
        setDirty(true);
    };

    const handleViewChange = (view: ViewChoice) => {
        updateUserSettings("view", view);
        setDirty(true);
    };

    const handleSaveUserSettings = () => {
        const { view, theme, formsPerPage, responsesPerPage } = userSettings;
        saveUserSettings({ view, theme, formsPerPage, responsesPerPage });
        commitSettings({ view, theme, formsPerPage, responsesPerPage });
        setTheme(theme);
        setDirty(false);
    };

    const handleDiscardUserSettings = () => {
        setDirty(false);
    };

    return (
        <div className="set-page o-page">
            <SettingsDecorations />

            <header className="set-head">
                <div>
                    <h1>Settings</h1>
                    <div className="sub">your desk, your paper, your rules</div>
                </div>
                <div className="head-actions">
                    {dirty && (
                        <span className="set-dirty">
                            <span className="o-dot o-dot--warning" /> unsaved changes
                        </span>
                    )}
                    <button
                        type="button"
                        className="o-btn o-btn--sm"
                        disabled={!dirty}
                        onClick={handleDiscardUserSettings}
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        className="o-btn o-btn--sm o-btn--accent"
                        disabled={!dirty}
                        onClick={handleSaveUserSettings}
                    >
                        <Icon name="check" size={14} /> Save changes
                    </button>
                </div>
            </header>

            <div className="set-grid">
                <SettingsNav active={section} onSelect={setSection} isAdmin={isAdmin} />

                <div className="set-content">
                    {/* Renders if section is 'profile' */}
                    <ProfilePanel
                        section={section}
                        draft={profile}
                        email={VIEWER.email}
                        role={VIEWER.role}
                        // onChange={touch(setProfile)}
                        onChange={() => { }}
                    />

                    {/* Renders if section is 'appearance' */}
                    <AppearancePanel
                        section={section}
                        theme={theme}
                        view={view}
                        onChange={(theme) => handleThemeChange(theme)}
                        onViewChange={(view) => handleViewChange(view)}
                    />

                    {/* Renders if section is 'preferences' */}
                    <PreferencesPanel
                        section={section}
                        draft={prefs}
                        onChange={handlePreferenceChange(setPrefs)}
                    // onChange={handleChangePreferences}
                    />

                    {/* Renders if section is 'danger' */}
                    <DangerPanel section={section} onDeleteAccount={() => setDeleteAccount(true)} />
                </div>
            </div>

            <div className="set-footnote">
                <div className="o-note o-note--sticky o-note--green">
                    ★ tip — every change waits on the desk until you press <b>Save</b>
                </div>
            </div>

            <ConfirmDialog
                open={deleteAccount}
                icon="trash"
                tone="danger"
                title="Delete your account?"
                description="Forms, responses and uploads are held for 30 days, then erased for good."
                confirmLabel="Delete account"
                onCancel={() => setDeleteAccount(false)}
                onConfirm={() => setDeleteAccount(false)}
            />
        </div>
    );
};

export default Settings;
