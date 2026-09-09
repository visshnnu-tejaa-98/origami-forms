import { DARK, FORMS_VIEWS, LIGHT } from "@repo/database/constants";
import { IconName } from "../components/icons";

export const ROLES = ["subscriber", "starter", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type ThemeChoice = typeof LIGHT | typeof DARK;

export type ViewChoice = (typeof FORMS_VIEWS)[number];

export type SettingsSection =
    | "profile"
    | "appearance"
    | "preferences"
    | "danger";

export type SettingsTab = {
    id: SettingsSection;
    label: string;
    icon: IconName;
    adminOnly?: boolean;
    tone?: "danger";
};

export type ManagedUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    avatarUrl?: string;
    forms: number;
    responses: number;
    joinedAt: string;
    status: "active" | "invited" | "suspended";
};

export type ProfileDraft = {
    role: string,
    email: string,
    firstName: string;
    lastName: string;
    avatarUrl: string;
};

export type PreferencesDraft = {
    formsPerPage: number;
    responsesPerPage: number;
};

export type ProfilePanelProps = {
    section: SettingsSection;
    profile: ProfileDraft;
    updateUserProfile: (profile: ProfileDraft) => void;
};

export type SizeRowProps = {
    label: string;
    help: string;
    name: string;
    value: number;
    onPick: (value: number) => void;
};

export type PreferencesPanelProps = {
    section: SettingsSection
    draft: PreferencesDraft;
    onChange: (patch: Partial<PreferencesDraft>) => void;
};

export type AppearancePanelProps = {
    section: SettingsSection
    theme: ThemeChoice;
    view: ViewChoice;
    onChange: (theme: ThemeChoice) => void;
    onViewChange: (view: ViewChoice) => void;
};

export type DangerPanelProps = {
    section: SettingsSection
    onDeleteAccount: () => void;
};
