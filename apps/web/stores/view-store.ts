"use client";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GRID } from "~/app/(main)/constants";
import type { View } from "~/app/(main)/types";

type ViewStore = {
    view: View;
    setView: (view: View) => void;
};

export const useViewStore = create<ViewStore>()(
    persist(
        (set) => ({
            view: GRID,
            setView: (view) => set({ view }),
        }),
        { name: "origami:view" },
    ),
);

/**
 * `persist` reads localStorage after mount, so the first client render must
 * match the server's. Consumers show the default until this flips true.
 */
export const useViewHydrated = () => {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
    return hydrated;
};
