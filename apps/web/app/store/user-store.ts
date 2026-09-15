import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";
import { LIGHT, THEMES } from "@repo/database/constants";
import { GRID, LIST } from "../(main)/constants";
import { GetActivityType } from "@repo/services/analytics/model";

type User = {
    id: string,
    clerkId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    imageUrl: string;
    role: string;
}

export type UserSettingsType = {
    view: typeof LIST | typeof GRID
    theme: (typeof THEMES)[number]
    formsPerPage: number
    responsesPerPage: number
}

const ACTIVITY_FEED_LIMIT = 6;

type UserInitialState = {
    user: User | null;
    loading: boolean;
    error: boolean;
    errorMessage: string;
    settings: UserSettingsType
    activities: GetActivityType[]
}

type UserActions = {
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: boolean) => void;
    setErrorMessage: (errorMessage: string) => void;
    updateSettings: (settings: Partial<UserSettingsType>) => void;
    pushActivity: (activity: GetActivityType) => void;
    setActivities: (activities: GetActivityType[]) => void;
}

const userInitialState: UserInitialState = {
    user: null,
    loading: false,
    error: false,
    errorMessage: "",
    settings: {
        view: GRID,
        theme: LIGHT,
        formsPerPage: 10,
        responsesPerPage: 10
    },
    activities: []
}

export const useUserStore = create(
    devtools(
        persist(
            combine<UserInitialState, UserActions>(userInitialState, (set) => {
                return {
                    setUser: (user: User) => set({ user }),
                    clearUser: () => set({ user: null }),
                    setLoading: (loading: boolean) => set({ loading }),
                    setError: (error: boolean) => set({ error }),
                    setErrorMessage: (errorMessage: string) => set({ errorMessage }),
                    updateSettings: (settings: Partial<UserSettingsType>) => set((state) => ({
                        settings: { ...state.settings, ...settings }
                    })),
                    setActivities: (activities: GetActivityType[]) =>
                        set({ activities: activities.slice(0, ACTIVITY_FEED_LIMIT) }),
                    pushActivity: (activity: GetActivityType) => set((state) => ({
                        activities: [activity, ...state.activities].slice(0, ACTIVITY_FEED_LIMIT),
                    })),
                };
            }),
            {
                name: "user",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ user: state.user, settings: state.settings }),
            },
        ),
        {
            name: "Origami Store",
            store: "user",
            enabled: process.env.NODE_ENV === "development"
        }
    ),
);