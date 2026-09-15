"use client"

import React, { useEffect } from "react";
import { Icon } from "../../components/icons";
import { useGetActivities, usePushActivity } from "~/hooks/use-analytics";
import { TINTS } from "../../constants";
import { hash } from "../../utils";
import { useUserStore } from "~/app/store/user-store";
import { ActivityContentProps } from "../../types";
import { ActivitiesSkeleton } from "../skeletons";
import { useSocket } from "~/hooks/use-socket";
import { relativeTime } from "~/app/utils";

const ActivityAvatar = ({ avatarUrl, name }: { avatarUrl: string; name: string }) => {
    if (avatarUrl) {
        return <img src={avatarUrl} alt="" className="av av--img" loading="lazy" />;
    }
    return <span className="av">{name?.slice(0, 1).toUpperCase() || "A"}</span>;
};

const ActivityContent = (props: ActivityContentProps) => {
    const { creatorId, respondeeId, creatorName, respondeeName, creatorAvatarUrl, respondeeAvatarUrl, activityType, formName, occuredAt } = props;
    const user = useUserStore(state => state.user)

    const isCreatorMe = user?.id === creatorId;

    return (
        <div className="body">
            <strong>{!isCreatorMe ? "You" : respondeeName}</strong> {activityType} <strong>{formName}</strong> Form.
            <div className="time">{relativeTime(occuredAt)}</div>
        </div>
    );
};

const ActivitiesEmpty = () => (
    <div className="panel-state">
        <span className="art">
            <Icon name="crane" size={44} />
        </span>
        <h4>Nothing folded yet</h4>
        <p>Activity on your forms will land here as it happens.</p>
    </div>
);

const ActivitiesError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="panel-state is-error">
        <span className="art">
            <Icon name="error" size={44} />
        </span>
        <h4>That didn&apos;t unfold.</h4>
        <p>{message}</p>
        <button type="button" className="o-btn o-btn--ghost o-btn--sm" onClick={onRetry}>
            <Icon name="refresh" size={13} /> Try again
        </button>
    </div>
);

const Activities = () => {
    const {
        activities,
        getActivitiesIsPending,
        getActivitiesIsError,
        getActivitiesError,
        refetchActivities,
    } = useGetActivities();

    const pushActivityToRedux = useUserStore(state => state.pushActivity)
    const updateActivities = useUserStore(state => state.setActivities)
    const activitiesFromRedux = useUserStore(state => state.activities)
    useSocket({
        "response:created": (data) => {
            console.log("Activity from socket:", data);
            pushActivityToRedux(data)
            refetchActivities()
        },
        "form:drafted": (data) => {
            pushActivityToRedux({
                ...data,
                respondeeId: data.creatorId,
                respondeeName: data.creatorName,
                respondeeAvatarUrl: data.creatorAvatarUrl,
            });
            refetchActivities();
        },
        "form:published": (data) => {
            pushActivityToRedux({
                ...data,
                respondeeId: data.creatorId,
                respondeeName: data.creatorName,
                respondeeAvatarUrl: data.creatorAvatarUrl,
            });
            refetchActivities();
        },
    });

    useEffect(() => {
        if (activities.length === 0) return
        updateActivities(activities);
    }, [activities, updateActivities])

    const isLive = !getActivitiesIsPending && !getActivitiesIsError;

    const renderBody = () => {
        if (getActivitiesIsPending) return <ActivitiesSkeleton />;

        if (getActivitiesIsError) {
            return (
                <ActivitiesError
                    message={getActivitiesError?.message || "Failed to load activity"}
                    onRetry={() => refetchActivities()}
                />
            );
        }

        if (activities.length === 0) return <ActivitiesEmpty />;

        return (
            <div className="activity">
                {activities?.length && activitiesFromRedux.map((a, idx) => {
                    let tint = TINTS[hash(idx.toString()) % TINTS.length];
                    return (
                        <div key={idx} className={`row ${tint}`}>
                            <ActivityAvatar
                                avatarUrl={a.respondeeAvatarUrl ?? ""}
                                name={a.respondeeName ?? ""}
                            />
                            <div className="body">
                                <ActivityContent
                                    creatorId={a.creatorId ?? ""}
                                    respondeeId={a.respondeeId ?? ""}
                                    creatorName={a.creatorName ?? ""}
                                    respondeeName={a.respondeeName ?? ""}
                                    creatorAvatarUrl={a.creatorAvatarUrl ?? ""}
                                    respondeeAvatarUrl={a.respondeeAvatarUrl ?? ""}
                                    activityType={a.activityType}
                                    formName={a.formName}
                                    occuredAt={a.occuredAt}
                                />
                            </div>
                            <span className="pip" />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="panel" style={{ marginBottom: "22px" }}>
            <div className="panel-head">
                <h3>Activity</h3>
                {isLive && <span className="sub">live</span>}
                {isLive && (
                    <span className="o-dot o-dot--success pulse" style={{ marginLeft: "auto" }} />
                )}
            </div>
            {renderBody()}
            {isLive && activities.length > 0 && (
                <button className="o-btn o-btn--ghost o-btn--block o-btn--sm" style={{ marginTop: "10px" }}>
                    See all activity <Icon name="arrow" size={12} />
                </button>
            )}
        </div>
    );
};

export default Activities;
