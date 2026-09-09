"use client";

import { useEffect } from "react";
import { useUserStore } from "~/app/store/user-store";

export function useViewAttribute() {
    const view = useUserStore((state) => state.settings.view);

    useEffect(() => {
        document.documentElement.dataset.view = view;
    }, [view]);
}
