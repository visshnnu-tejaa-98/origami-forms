"use client";

import { useUserStore } from "~/app/store/user-store";
import { trpc } from "~/trpc/client";
import { useSocket } from "./use-socket";

/** the activity feed listens from the shell, not from the panel that renders it — a
 *  broadcast arrives while the builder is still on screen (or mid-redirect), long before
 *  the dashboard mounts, so a subscription scoped to `<Activities />` would miss it */
export function useActivityFeedSocket() {
    const utils = trpc.useUtils();
    const pushActivity = useUserStore((state) => state.pushActivity);

    useSocket({
        "response:submitted": (data) => {
            pushActivity(data);
            utils.analytics.getActivities.invalidate();
        },
        "form:drafted": (data) => {
            pushActivity(data);
            utils.analytics.getActivities.invalidate();
        },
    });
}
