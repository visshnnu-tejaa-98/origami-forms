"use client";

import { useSocket } from "~/hooks/use-socket";
import { useUserStore } from "~/app/store/user-store";
import { trpc } from "~/trpc/client";
import type { GetActivityType } from "@repo/services/analytics/model";

/**
 * Keeps the activity feed live from anywhere inside the app shell.
 *
 * This deliberately does NOT live in the Activities panel: drafting and publishing happen
 * in the builder and then redirect, so a listener owned by the dashboard is unmounted at
 * the exact moment its own events fire. Socket.IO does not replay, so those events were
 * being dropped. Mounted at the layout, the listener outlives every route change.
 */
export function ActivityRealtimeProvider({ children }: { children: React.ReactNode }) {
    const pushActivity = useUserStore((state) => state.pushActivity);
    const utils = trpc.useUtils();

    /** creator-only events carry no respondee — the creator is the actor */
    const fromCreator = (data: {
        creatorId: string;
        creatorName?: string | null;
        creatorAvatarUrl?: string | null;
    }) => ({
        respondeeId: data.creatorId,
        respondeeName: data.creatorName,
        respondeeAvatarUrl: data.creatorAvatarUrl,
    });

    const record = (activity: GetActivityType) => {
        pushActivity(activity);
        utils.analytics.getActivities.invalidate();
    };

    useSocket({
        "response:submitted": (data) => record(data),
        "form:viewed": (data) => record(data),
        "form:drafted": (data) => record({ ...data, ...fromCreator(data) }),
        "form:published": (data) => record({ ...data, ...fromCreator(data) }),
    });

    return <>{children}</>;
}
