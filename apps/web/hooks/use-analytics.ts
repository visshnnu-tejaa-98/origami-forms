import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { GetAnalyticsInputSchemaType } from "@repo/services/analytics/model";

export function usePushActivity() {
    const {
        mutateAsync: pushActivityAsync,
        mutate: pushActivity,
        error: pushActivityError,
        failureCount: pushActivityFailureCount,
        isError: pushActivityIsError,
        isPending: pushActivityIsPending,
        isSuccess: pushActivityIsSuccess,
        status: pushActivityStatus,
    } = trpc.analytics.pushActivity.useMutation({
        onSuccess: () => {
            toast.success("Activity recorded successfully");
        },
        onError: () => {
            toast.error("Failed to record activity");
        },
    });

    return {
        pushActivity,
        pushActivityAsync,
        pushActivityError,
        pushActivityFailureCount,
        pushActivityIsError,
        pushActivityIsPending,
        pushActivityIsSuccess,
        pushActivityStatus,
    };
}

export function useGetActivities() {
    const {
        data: activitiesResponse,
        error: getActivitiesError,
        failureCount: getActivitiesFailureCount,
        isError: getActivitiesIsError,
        isPending: getActivitiesIsPending,
        isSuccess: getActivitiesIsSuccess,
        status: getActivitiesStatus,
        refetch: refetchActivities,
    } = trpc.analytics.getActivities.useQuery({}, {
        refetchOnWindowFocus: true,
    });

    const activities = activitiesResponse?.data || [];

    return {
        activities,
        activitiesResponse,
        getActivitiesError,
        getActivitiesFailureCount,
        getActivitiesIsError,
        getActivitiesIsPending,
        getActivitiesIsSuccess,
        getActivitiesStatus,
        refetchActivities,
    };
}

export function useGetAnalytics({ formId, scope }: { formId?: string, scope: GetAnalyticsInputSchemaType["scope"] }) {
    const {
        data: analyticsResponse,
        error: getAnalyticsError,
        failureCount: getAnalyticsFailureCount,
        isError: getAnalyticsIsError,
        isPending: getAnalyticsIsPending,
        isSuccess: getAnalyticsIsSuccess,
        status: getAnalyticsStatus,
        refetch: refetchAnalytics,
    } = trpc.analytics.getAnalytics.useQuery({ formId, scope }, {
        refetchOnWindowFocus: true,
    });

    // const analytics = analyticsResponse?.analytics || [];

    return {
        analytics: analyticsResponse,
        analyticsResponse,
        getAnalyticsError,
        getAnalyticsFailureCount,
        getAnalyticsIsError,
        getAnalyticsIsPending,
        getAnalyticsIsSuccess,
        getAnalyticsStatus,
        refetchAnalytics,
    };
}