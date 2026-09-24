import { activities, and, avg, count, db, desc, eq, formFields, formResponses, forms, gte, inArray, isNull, lt, lte, or, responseAnswers, sql, users, views } from "@repo/database";
import { AUTHENTICATED } from "@repo/database/constants";
import { GetActivitiesInputType, GetActivitiesOutputType, getAnalyticsInputSchema, GetAnalyticsInputSchemaType, getAnalyticsOutputSchema, GetAnalyticsOutputSchemaType, PushActivityInputSchemaType, PushActivityOutputSchema } from "./model";
import UserService from "../user";

const fullName = (user?: { firstName: string; lastName: string | null, email: string } | null): string => {
    if (!user) return "";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
    return name || user.email.split("@")[0] || "";
}

export default class AnalyticsService {

    private readonly userService = new UserService();

    public async getCountryFlag() {

    }

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

        const activity = await db.transaction(async (tx) => {
            await tx.insert(views).values({
                formId,
                viewedAt: new Date(),
                sessionId: crypto.randomUUID(),
            });

            if (form.visibility !== AUTHENTICATED) {
                throw new Error("Activity is only tracked for authenticated forms");
            }
            const [activityResponse] = await tx
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
            return activityResponse;
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
        const condition = and(
            or(eq(activities.respondeeId, requesterId), eq(activities.creatorId, requesterId)),
            isNull(activities.deletedAt),
        );
        const activitiesFromDb = await db.query.activities.findMany({
            where: condition,
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

    public async getAnalytics(payload: GetAnalyticsInputSchemaType): Promise<GetAnalyticsOutputSchemaType> {
        const parsedPayload = await getAnalyticsInputSchema.safeParseAsync(payload)

        if (!parsedPayload.success) {
            return {
                success: false,
                message: "Invalid payload",
                analytics: null,
            }
        }

        const { scope, formId, requesterId } = parsedPayload.data;

        const isAdmin = await this.userService.isAdmin(requesterId);

        const conditions = [isNull(forms.deletedAt)];

        if (!isAdmin) {
            conditions.push(eq(forms.creatorId, requesterId))
        }

        const now = new Date();

        const ONE_DAY = 1 * 24 * 60 * 60 * 1000;
        const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
        const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

        if (!["1", "7", "30", "lifetime"].includes(scope)) {
            throw new Error("Invalid scope")
        }

        if (formId) {
            conditions.push(eq(forms.id, formId))
        }

        let startDate: Date | null;
        let endDate: Date;
        let lastScopeStartDate: Date | null;
        let lastScopeEndDate: Date;
        switch (scope) {
            case "1":
                startDate = new Date(now.getTime() - ONE_DAY);
                endDate = now;
                lastScopeStartDate = new Date(startDate.getTime() - (1 * ONE_DAY));
                lastScopeEndDate = startDate
                break;
            case "7":
                startDate = new Date(now.getTime() - ONE_WEEK);
                endDate = now;
                lastScopeStartDate = new Date(startDate.getTime() - (1 * ONE_WEEK));
                lastScopeEndDate = startDate
                break;
            case "30":
                startDate = new Date(now.getTime() - ONE_MONTH);
                endDate = now;
                lastScopeStartDate = new Date(startDate.getTime() - (1 * ONE_MONTH));
                lastScopeEndDate = startDate
                break;
            case "lifetime":
                startDate = null
                endDate = now;
                lastScopeStartDate = null
                lastScopeEndDate = now
                break;
        }

        const condition = and(...conditions)

        const inResponseWindow = startDate
            ? and(gte(formResponses.submittedAt, startDate), lte(formResponses.submittedAt, endDate))
            : undefined;
        const inViewWindow = startDate
            ? and(gte(views.viewedAt, startDate), lte(views.viewedAt, endDate))
            : undefined;

        const targetedForms = db.select({ id: forms.id }).from(forms).where(condition);

        const TREND_BUCKET: Record<string, string> = {
            "1": "1 hour",
            "7": "1 day",
            "30": "1 day",
            lifetime: "1 week",
        };
        const bucketInterval = TREND_BUCKET[scope] ?? "1 day";

        const scopedFormQuery = formId
            ? db
                .select({ id: forms.id, title: forms.title, status: forms.status })
                .from(forms)
                .where(condition)
                .limit(1)
            : Promise.resolve([]);

        const totalFormsQuery = db.$count(forms, condition)
        const totalResponsesQuery = db
            .select({ total: count() })
            .from(formResponses)
            .where(
                and(
                    isNull(formResponses.deletedAt),
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                ),
            );
        const totalViewsQuery = db
            .select({
                count: count(),
            })
            .from(views)
            .where(
                and(
                    isNull(views.deletedAt),
                    inArray(views.formId, targetedForms),
                    inViewWindow,
                ),
            );
        const completedResponsesQuery = db
            .select({
                count: count(),
            })
            .from(formResponses)
            .where(
                and(
                    eq(formResponses.status, "completed"),
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                    isNull(formResponses.deletedAt),
                ),
            );
        const avgTimeCompletionQuery = db
            .select({ avgTime: avg(formResponses.CompletionTimeInSec) })
            .from(formResponses)
            .where(
                and(
                    eq(formResponses.status, "completed"),
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                    isNull(formResponses.deletedAt),
                ),
            );
        const peakResponseCountQuery = db
            .select({
                date: sql<string>`DATE_TRUNC('day', ${formResponses.submittedAt})`.as(
                    "submission_date",
                ),
                count: count(),
            })
            .from(formResponses)
            .where(
                and(
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                    isNull(formResponses.deletedAt),
                ),
            )
            .groupBy(sql`submission_date`)
            .orderBy(desc(count()))
            .limit(1);
        const dailyAverageQuery = db
            .select({
                dailyAvg: sql<string>`avg(${sql`total_count`})`,
            })
            .from(
                db
                    .select({
                        submissionDate: sql<string>`DATE_TRUNC('day', ${formResponses.submittedAt})`.as(
                            "submission_date",
                        ),
                        totalCount: count().as("total_count"),
                    })
                    .from(formResponses)
                    .where(
                        and(
                            inArray(formResponses.formId, targetedForms),
                            inResponseWindow,
                            isNull(formResponses.deletedAt),
                        ),
                    )
                    .groupBy(sql`submission_date`)
                    .as("daily_counts"),
            );
        const deviceStatsQuery = db
            .select({
                deviceType: sql<string>`${formResponses.metaData}->>'device'`.as("device_type"),
                percentage: sql<number>`ROUND((COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER()) * 100, 2)`.as('percentage')
            })
            .from(formResponses)
            .where(
                and(
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                    isNull(formResponses.deletedAt),
                ),
            )
            .groupBy(sql`device_type`)
            .orderBy(desc(count()))

        const countryStatsQuery = db.select({
            country: sql<string>`${formResponses.metaData}->>'country'`.as("country"),
            percentage: sql<number>`ROUND((COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER()) * 100, 2)`.as('percentage')

        })
            .from(formResponses)
            .where(
                and(
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                    isNull(formResponses.deletedAt),
                ),
            )
            .groupBy(sql`country`)
            .orderBy(desc(count()))

        const cityStatsQuery = db.select({
            city: sql<string>`${formResponses.metaData}->>'city'`.as("city"),
            percentage: sql<number>`ROUND((COUNT(*)::NUMERIC / SUM(COUNT(*)) OVER()) * 100, 2)`.as('percentage')
        })
            .from(formResponses)
            .where(
                and(
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                    isNull(formResponses.deletedAt),
                ),
            )
            .groupBy(sql`city`)
            .orderBy(desc(count()))


        const windowedResponses = db
            .select({ id: formResponses.id })
            .from(formResponses)
            .where(
                and(
                    isNull(formResponses.deletedAt),
                    inArray(formResponses.formId, targetedForms),
                    inResponseWindow,
                ),
            );

        const answerBreakdownRawQuery = db
            .select({
                fieldId: formFields.id,
                questionTitle: formFields.label,
                questionType: formFields.type,
                optionsConfig: formFields.options,
                answeredCount: count(responseAnswers.value).as('answered_count'),
                rawAnswers: sql<string[] | null>`jsonb_agg(${responseAnswers.value}) FILTER (WHERE ${responseAnswers.value} IS NOT NULL)`.as('raw_answers')
            })
            .from(formFields)
            .leftJoin(
                responseAnswers,
                and(
                    eq(responseAnswers.formFieldId, formFields.id),
                    isNull(responseAnswers.deletedAt),
                    inArray(responseAnswers.responseId, windowedResponses)
                )
            )
            .where(
                and(
                    inArray(formFields.formId, targetedForms),
                    isNull(formFields.deletedAt)
                )
            )
            .groupBy(formFields.id, formFields.label, formFields.type, formFields.options);


        let trendStart: Date | null = startDate;
        if (!trendStart) {
            const [earliest] = await db
                .select({ first: sql<Date | null>`MIN(${formResponses.submittedAt})` })
                .from(formResponses)
                .where(
                    and(
                        isNull(formResponses.deletedAt),
                        inArray(formResponses.formId, targetedForms),
                    ),
                );
            trendStart = earliest?.first ? new Date(earliest.first) : null;
        }

        const emptyTrend = Promise.resolve([] as { date: string; total: number }[]);

        const bucketGrid = sql`generate_series(
            DATE_TRUNC('hour', ${trendStart}::timestamptz),
            ${endDate}::timestamptz,
            ${bucketInterval}::interval
        ) AS bucket(start)`;
        const bucketStart = sql`bucket.start`;
        const bucketEnd = sql`${bucketStart} + ${bucketInterval}::interval`;

        const submissionsTrendQuery = trendStart
            ? db
                .select({ date: sql<string>`bucket.start`, total: count(formResponses.id) })
                .from(bucketGrid)
                .leftJoin(
                    formResponses,
                    and(
                        gte(formResponses.submittedAt, bucketStart),
                        lt(formResponses.submittedAt, bucketEnd),
                        gte(formResponses.submittedAt, trendStart),
                        isNull(formResponses.deletedAt),
                        inArray(formResponses.formId, targetedForms),
                    ),
                )
                .groupBy(bucketStart)
                .orderBy(bucketStart)
            : emptyTrend;

        const viewsTrendQuery = trendStart
            ? db
                .select({ date: sql<string>`bucket.start`, total: count(views.id) })
                .from(bucketGrid)
                .leftJoin(
                    views,
                    and(
                        gte(views.viewedAt, bucketStart),
                        lt(views.viewedAt, bucketEnd),
                        gte(views.viewedAt, trendStart),
                        isNull(views.deletedAt),
                        inArray(views.formId, targetedForms),
                    ),
                )
                .groupBy(bucketStart)
                .orderBy(bucketStart)
            : emptyTrend;

        const [
            totalForms,
            totalResponses,
            totalViews,
            completedResponses,
            avgTimeCompletion,
            peakResponsesOnADay,
            dailyAverage,
            deviceStats,
            countryStats,
            cityStats,
            answerBreakdown,
            submissionsTrend,
            viewsTrend,
            scopedForm
        ] = await Promise.all([
            totalFormsQuery,
            totalResponsesQuery,
            totalViewsQuery,
            completedResponsesQuery,
            avgTimeCompletionQuery,
            peakResponseCountQuery,
            dailyAverageQuery,
            deviceStatsQuery,
            countryStatsQuery,
            cityStatsQuery,
            answerBreakdownRawQuery,
            submissionsTrendQuery,
            viewsTrendQuery,
            scopedFormQuery
        ]);


        const viewsByBucket = new Map(
            viewsTrend.map((row) => [new Date(row.date).toISOString(), row.total]),
        );
        const trend = submissionsTrend.map((row) => {
            const date = new Date(row.date).toISOString();
            return {
                date,
                submissions: row.total,
                views: viewsByBucket.get(date) ?? 0,
            };
        });

        const totalResponsesValue = Number(totalResponses[0]?.total) || 0;
        const totalViewsValue = Number(totalViews[0]?.count) || 0;
        const completedResponsesValue = Number(completedResponses[0]?.count) || 0;
        const completionRate = totalResponsesValue > 0 ? Math.round((completedResponsesValue / totalResponsesValue) * 100) : 0;
        const avgTime = totalResponsesValue > 0 ? Math.round(Number(avgTimeCompletion?.[0]?.avgTime) ?? 0) : 0;
        const peakResponsesOnADayValue = totalResponsesValue > 0 ? peakResponsesOnADay[0] : { date: null, count: 0 };
        const dailyAverageValue = totalResponsesValue > 0 ? Math.round(Number(dailyAverage?.[0]?.dailyAvg)) : 0;
        const deviceStatsValue = deviceStats.map(ds => ds.deviceType === null ? { ...ds, deviceType: "unknown" } : ds);
        const countryStatsValue = countryStats.map(cs => cs.country === null ? { ...cs, country: "unknown" } : cs);
        const cityStatsValue = cityStats.map(cs => cs.city === null ? { ...cs, city: "unknown" } : cs);

        const answerBreakdownAnalytics = answerBreakdown.map((field) => {
            const answered = Number(field.answeredCount);
            const skippedCount = Math.max(0, totalResponsesValue - answered);
            const configuredOptions = Array.isArray(field.optionsConfig) ? field.optionsConfig : null;
            const answersList = field.rawAnswers || [];

            let processedOptions = null;

            if (configuredOptions && configuredOptions.length > 0) {
                const choiceFrequencies: Record<string, number> = {};

                answersList.forEach((val) => {
                    if (val.startsWith('[') || val.includes(',')) {
                        try {
                            const parsed: string[] = val.startsWith('[') ? JSON.parse(val) : val.split(',');
                            parsed.forEach(v => {
                                const cleanKey = v.trim();
                                choiceFrequencies[cleanKey] = (choiceFrequencies[cleanKey] || 0) + 1;
                            });
                        } catch {
                            choiceFrequencies[val] = (choiceFrequencies[val] || 0) + 1;
                        }
                    } else {
                        choiceFrequencies[val] = (choiceFrequencies[val] || 0) + 1;
                    }
                });

                processedOptions = configuredOptions.map((opt) => {
                    const matchCount = choiceFrequencies[opt.value] || choiceFrequencies[opt.label] || 0;
                    const pct = answered > 0 ? ((matchCount / answered) * 100).toFixed(2) : "0.00";

                    return {
                        optionLabel: opt.label,
                        percentage: `${pct}%`
                    };
                });
            }

            return {
                questionTitle: field.questionTitle,
                questionType: field.questionType,
                answeredCount: answered,
                skippedCount: skippedCount,
                options: processedOptions
            };
        });

        const resultObj = {
            success: true,
            message: "Analytics retrieved successfully",
            analytics: {
                form: scopedForm[0] ?? null,
                currentScope: scope,
                startDate,
                endDate,
                lastScope: scope,
                lastScopeStartDate,
                lastScopeEndDate,
                totalForms,
                totalResponses: totalResponsesValue,
                totalViews: totalViewsValue,
                completedResponses: completedResponsesValue,
                completionRate,
                avgTimeCompletion: avgTime,
                peakResponsesOnADay: peakResponsesOnADayValue,
                dailyAverage: dailyAverageValue,
                deviceStats: deviceStatsValue,
                countryStats: countryStatsValue,
                cityStats: cityStatsValue,
                answerBreakdownAnalytics,
                trend
            }
        }

        const result = await getAnalyticsOutputSchema.safeParseAsync(resultObj)
        if (!result.data) {
            return {
                success: false,
                message: "Analytics retrieval failed, " + result.error.message,
                analytics: null,
            }
        }

        return result.data
    }
}


// const analyticsService = new AnalyticsService();

// analyticsService.getAnalytics({
//     scope: "30",
//     formId: "bda6e3ca-fb6d-4407-abc5-fc758687fc58",
//     requesterId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
// }).then(data => console.log(data)).catch(err => console.log(err))
