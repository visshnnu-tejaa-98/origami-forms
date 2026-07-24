import { create } from "zustand"
import { combine, createJSONStorage, devtools, persist } from 'zustand/middleware'

interface User {
    clerkId: string,
    firstName: string,
    lastName: string,
    emailAddress: string,
    imageUrl: string,
}


interface UserInitialState {
    user: User | null,
    loading: boolean,
    error: boolean,
    errorMessage: string,
}

interface UserActions {
    setUser: (user: User) => void,
    clearUser: () => void,
    setLoading: (loading: boolean) => void,
    setError: (error: boolean) => void,
    setErrorMessage: (errorMessage: string) => void,
}

const userInitialState: UserInitialState = {
    user: null,
    loading: false,
    error: false,
    errorMessage: '',
}


export const useUserStore = create(devtools(persist(combine<UserInitialState, UserActions>(userInitialState, (set) => {
    return {
        setUser: (user: User) => set({ user }),
        clearUser: () => set({ user: null }),
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: boolean) => set({ error }),
        setErrorMessage: (errorMessage: string) => set({ errorMessage }),
    }
}), {
    name: "user",
    storage: createJSONStorage(() => localStorage),
})))