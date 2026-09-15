import { activities, and, db, desc, eq, forms, isNull, or } from "@repo/database";
import { AUTHENTICATED, CREATOR_ACTIVITY_TYPES, PUBLISHED } from "@repo/database/constants";
import { GetActivitiesInputType, getActivitiesOutputSchema, GetActivitiesOutputType, PushActivityInputSchemaType, pushActivityOutputSchema, PushActivityOutputSchema } from "./model";

const fullName = (user?: { firstName: string; lastName: string | null, email: string } | null): string => {
    if (!user) return "";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    return name || user.email.split("@")[0] || "";
}

export default class AnalyticsService {
    public async pushActivity(payload: PushActivityInputSchemaType): Promise<PushActivityOutputSchema> {
        const { formId, activityType, metaData, requesterId } = payload;
        // the two actors are gated differently: a creator event must come from the owner,
        // while a respondent event comes from someone who is deliberately not the owner and
        // is authorised instead by the form being published and requiring a sign-in
        const isCreatorActivity = (CREATOR_ACTIVITY_TYPES as readonly string[]).includes(activityType);
        const [form] = await db
            .select({
                creatorId: forms.creatorId,
                visibility: forms.visibility,
                status: forms.status,
            })
            .from(forms)
            .where(and(eq(forms.id, formId), isNull(forms.deletedAt)));

        if (!form) throw new Error("Form not found");

        if (isCreatorActivity && form.creatorId !== requesterId) {
            throw new Error("You are not authorized to perform this action");
        }

        // a respondent event is only attributable on a form that required a sign-in
        if (!isCreatorActivity && form.visibility !== AUTHENTICATED) {
            throw new Error("Activity is only tracked for authenticated forms");
        }

        if (!isCreatorActivity && form.status !== PUBLISHED) {
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
                respondeeId: activities.respondeeId || "",
                activityType: activities.activityType,
                metaData: activities.metaData || {},
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



        const res = await getActivitiesOutputSchema.safeParseAsync({
            success: true,
            message: "Activities fetched successfully",
            data: formattedData,
        })

        if (!res.success) {
            console.log("Failed to parse activities", res.error)
            return {
                success: false,
                message: "Failed to parse activities",
                data: [],
            }
        }
        return res.data
    }
}
