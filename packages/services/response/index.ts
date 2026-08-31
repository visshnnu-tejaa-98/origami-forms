import {
    db,
    forms,
    formResponses,
    isNull,
    and,
    ilike,
    or,
    users,
    desc,
    asc,
    inArray,
    eq
} from "@repo/database";
import { FormResponsesStatsInputType, formResponsesStatsListInputSchema, formResponsesStatsOutputSchema, FormResponsesStatsOutputType, ListResponseOutputType, ListResponsesInput, listResponsesInputSchema, listResponsesOutputSchema } from "./model";
import UserService from "../user";
import { ALL } from "@repo/database/constants";

export default class ResponseService {
    private readonly userService = new UserService();

    public async listResponses(props: ListResponsesInput) {
        const { requesterId, formId, page, pageSize, search, sortBy, sortOrder, status } =
            listResponsesInputSchema.parse(props);

        const isAdmin = await this.userService.isAdmin(requesterId);

        const conditions = [isNull(forms.deletedAt)];

        if (!isAdmin) conditions.push(eq(forms.creatorId, requesterId));

        if (formId) conditions.push(eq(forms.id, formId));

        const filters = [
            inArray(
                formResponses.formId,
                db
                    .select({ id: forms.id })
                    .from(forms)
                    .where(and(...conditions)),
            ),
        ];

        if (search) {
            const searchTerm = `%${search}%`;
            filters.push(
                or(
                    inArray(
                        formResponses.userId,
                        db
                            .select({ id: users.id })
                            .from(users)
                            .where(
                                or(
                                    ilike(users.email, searchTerm),
                                    ilike(users.firstName, searchTerm),
                                    ilike(users.lastName, searchTerm),
                                ),
                            ),
                    ),
                    inArray(
                        formResponses.formId,
                        db
                            .select({ id: forms.id })
                            .from(forms)
                            .where(and(ilike(forms.title, searchTerm), ...conditions)),
                    ),
                )!,
            );
        }

        if (status !== ALL) {
            filters.push(eq(formResponses.status, status));
        }

        const whereCondition = and(...filters)!;

        const sortColumns = {
            submittedAt: formResponses.submittedAt,
            completionTimeInSec: formResponses.CompletionTimeInSec,
        } as const;

        const orderBy =
            sortOrder === "desc"
                ? [desc(sortColumns[sortBy]), desc(formResponses.id)]
                : [asc(sortColumns[sortBy]), asc(formResponses.id)];

        const [responses, totalItems] = await Promise.all([
            db.query.formResponses.findMany({
                where: whereCondition,
                columns: {
                    id: true,
                    formId: true,
                    status: true,
                    metaData: true,
                    submittedAt: true,
                    CompletionTimeInSec: true,
                },
                with: {
                    user: {
                        columns: {
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    form: {
                        columns: {
                            id: true,
                            creatorId: true,
                            title: true,
                            logoUrl: true,
                            status: true,
                            updatedAt: true,
                        },
                        with: {
                            fields: {
                                where: (f, { isNull }) => isNull(f.deletedAt),
                                orderBy: (f, { asc }) => asc(f.order),
                                columns: {
                                    id: true,
                                    label: true,
                                    type: true,
                                    order: true,
                                },
                            },
                        },
                    },
                    answers: {
                        columns: {
                            id: true,
                            formFieldId: true,
                            value: true,
                        },
                    },
                },
                orderBy,
                limit: pageSize,
                offset: (page - 1) * pageSize,
            }),
            db.$count(formResponses, whereCondition),
        ]);

        const hydratedResponses = responses.map((row) => {
            const answerMap = new Map(row.answers.map((answer) => [answer.formFieldId, answer.value]));
            const { user, form, answers: dbAnswers, ...response } = row;

            let name: string | undefined = undefined;

            if (user) {
                name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
            }

            const alignedAnswers = form.fields.map((field) => {
                return {
                    fieldId: field.id,
                    fieldType: field.type,
                    fieldLabel: field.label,
                    value: answerMap.get(field.id) ?? null,
                    order: field.order,
                };
            });

            return {
                id: response.id,
                status: response.status,
                metaData: response.metaData,
                submittedAt: response.submittedAt ? response.submittedAt.toISOString() : undefined,
                completionTimeInSec: response.CompletionTimeInSec,
                email: user?.email || undefined,
                name,
                logoUrl: form.logoUrl,
                formTitle: form.title,
                answers: alignedAnswers,
            };
        });

        const totalPages = Math.ceil(totalItems / pageSize);

        const hydratedResult: ListResponseOutputType = {
            responses: hydratedResponses,
            page,
            pageSize,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };

        const result = await listResponsesOutputSchema.safeParseAsync(hydratedResult);

        return result.data
    }

    public async responsesStats(payload: FormResponsesStatsInputType) {
        const { requesterId } = formResponsesStatsListInputSchema.parse(payload);

        const isAdmin = await this.userService.isAdmin(requesterId);

        const formConditions = [isNull(forms.deletedAt)];
        if (!isAdmin) formConditions.push(eq(forms.creatorId, requesterId));

        const whereCondition = and(
            isNull(formResponses.deletedAt),
            inArray(
                formResponses.formId,
                db.select({ id: forms.id }).from(forms).where(and(...formConditions)),
            ),
        )!;

        const rows = await db.query.formResponses.findMany({
            where: whereCondition,
            columns: { status: true },
        });

        return {
            completed: rows.filter((r) => r.status === "completed").length,
            partial: rows.filter((r) => r.status === "partial").length,
        };
    }
}

// const responseService = new ResponseService();

// responseService
//     .listResponses({
//         formId: "9ab9bdf7-705b-4bd8-a860-d1c41ce5b4a9",
//         requesterId: "477c6c48-ae0c-4bd5-8f36-9c5687e74be6",
//         page: 1,
//         pageSize: 5,
//         search: undefined,
//         status: "completed",
//         sortBy: "submittedAt",
//         sortOrder: "desc",
//     })
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
