import { activities, and, db, desc, eq, forms, isNull, or } from "@repo/database";
import { AUTHENTICATED, CREATED, PUBLISHED } from "@repo/database/constants";
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
            })
            .from(forms)
            .where(and(eq(forms.id, formId), isNull(forms.deletedAt)));

        if (!form) throw new Error("Form not found");

        if (form.visibility !== AUTHENTICATED) {
            throw new Error("Activity is only tracked for authenticated forms");
        }

        if (activityType === CREATED && form.creatorId !== requesterId) {
            throw new Error("You are not authorized to perform this action");
        }

        if (activityType !== CREATED && form.status !== PUBLISHED) {
            throw new Error("This form is not accepting responses");
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

        return {
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
                        title: true
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
