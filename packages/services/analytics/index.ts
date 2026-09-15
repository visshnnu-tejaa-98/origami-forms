import { activities, and, db, desc, eq, forms, isNull, or, users } from "@repo/database";
import { AUTHENTICATED } from "@repo/database/constants";
import { GetActivitiesInputType, GetActivitiesOutputType, PushActivityInputSchemaType, PushActivityOutputSchema } from "./model";

const fullName = (user?: { firstName: string; lastName: string | null, email: string } | null): string => {
    if (!user) return "";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    return name || user.email.split("@")[0] || "";
}

export default class AnalyticsService {
    public async pushActivity(payload: PushActivityInputSchemaType): Promise<PushActivityOutputSchema> {
        const { formId, activityType, metaData, requesterId } = payload;
        const [form] = await db
            .select({
                creatorId: forms.creatorId,
                visibility: forms.visibility,
                status: forms.status,
                title: forms.title,
            })
            .from(forms)
            .where(and(eq(forms.id, formId), isNull(forms.deletedAt)));

        if (!form) throw new Error("Form not found");

        if (form.visibility !== AUTHENTICATED) {
            throw new Error("Activity is only tracked for authenticated forms");
        }

        const [activity] = await db
            .insert(activities)
            .values({
                formId,
                creatorId: form.creatorId,
                respondeeId: requesterId,
                activityType,
                metaData,
            })
            .returning({
                id: activities.id,
                formId: activities.formId,
                creatorId: activities.creatorId,
                respondeeId: activities.respondeeId,
                activityType: activities.activityType,
                metaData: activities.metaData,
                occuredAt: activities.occuredAt,
                updatedAt: activities.updatedAt,
            });

        if (!activity) throw new Error("Failed to record activity");

        // the feed renders names and avatars, so the broadcast carries them — otherwise the
        // optimistic row would show blanks until the refetch lands
        const [creator, respondee] = await Promise.all([
            db.query.users.findFirst({
                where: eq(users.id, form.creatorId),
                columns: { firstName: true, lastName: true, email: true, avatarUrl: true },
            }),
            db.query.users.findFirst({
                where: eq(users.id, requesterId),
                columns: { firstName: true, lastName: true, email: true, avatarUrl: true },
            }),
        ]);

        return {
            realTime: {
                creatorId: form.creatorId,
                creatorName: fullName(creator),
                creatorAvatarUrl: creator?.avatarUrl ?? null,
                respondeeId: requesterId,
                respondeeName: fullName(respondee),
                respondeeAvatarUrl: respondee?.avatarUrl ?? null,
                formId,
                formName: form.title,
                activityType,
                occuredAt: activity.occuredAt.toISOString(),
            },
            id: activity.id,
            formId: activity.formId,
            creatorId: activity.creatorId,
            respondeeId: activity.respondeeId,
            activityType: activity.activityType,
            occuredAt: activity.occuredAt.toISOString(),
            updatedAt: activity.updatedAt?.toISOString(),
            metaData: activity.metaData,
        };
    }
    public async getActivities(payload: GetActivitiesInputType): Promise<GetActivitiesOutputType> {
        const { requesterId } = payload
        const activitiesFromDb = await db.query.activities.findMany({
            where: or(eq(activities.respondeeId, requesterId), eq(activities.creatorId, requesterId)),
            with: {
                form: {
                    columns: {
                        title: true,
                        id: true
                    }
                },
                creator: {
                    columns: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    }
                },
                respondee: {
                    columns: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    }
                }
            },
            limit: 6,
            orderBy: desc(activities.occuredAt),
        })

        if (!activitiesFromDb || activitiesFromDb.length === 0) {
            return {
                success: false,
                message: "No activities found",
                data: [],
            }
        }

        const formattedData = activitiesFromDb.map((activity) => {
            const creatorName = fullName(activity.creator)
            const respondeeName = fullName(activity.respondee)

            return {
                formId: activity.formId,
                creatorId: activity.creatorId,
                respondeeId: activity.respondeeId,
                creatorName,
                respondeeName,
                creatorAvatarUrl: activity.creator?.avatarUrl || "",
                respondeeAvatarUrl: activity.respondee?.avatarUrl || "",
                activityType: activity.activityType,
                formName: activity.form?.title || "Untitled Form",
                occuredAt: activity.occuredAt.toISOString(),
            };
        });

        return {
            success: true,
            message: "Activities retrieved successfully",
            data: formattedData
        };

    }
}
