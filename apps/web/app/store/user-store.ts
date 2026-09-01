import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";
import { GRID, LIST } from "../(main)/constants";

type User = {
    id: string,
    clerkId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    imageUrl: string;
}

export type UserSettingsType = {
    view: typeof LIST | typeof GRID
}

type UserInitialState = {
    user: User | null;
    loading: boolean;
    error: boolean;
    errorMessage: string;
    settings: UserSettingsType
}

type UserActions = {
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: boolean) => void;
    setErrorMessage: (errorMessage: string) => void;
    updateSettings: (settings: Partial<UserSettingsType>) => void;
}

const userInitialState: UserInitialState = {
    user: null,
    loading: false,
    error: false,
    errorMessage: "",
    settings: { view: GRID }
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
                };
            }),
            {
                name: "user",
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ user: state.user }),
            },
        ),
        {
            name: "Origami Store",
            store: "user",
            enabled: process.env.NODE_ENV === "development"
        }
    ),
);