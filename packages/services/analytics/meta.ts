// Used for docs generation

import { GET, POST } from "../constants";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

type OpenApiMetaConfig = {
    openapi: {
        method: HttpMethod;
        path: `/${string}`;
        tags?: string[];
        summary?: string;
        description?: string;
    };
};

type AnalyticsMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const pushActivityMeta = ({ getPathFn, tags }: AnalyticsMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: POST,
            path: pathType,
            tags: tags ?? ["Analytics"],
            summary: "Record a form activity",
            description: `
### Overview

Appends a single activity row to a form's analytics log, and records a view of that form.

### Events

\`activityType\` accepts \`drafted\`, \`published\`, \`submitted\` and \`viewed\`. The stored
enum also contains \`edited\`, which is written by the form service rather than through
this endpoint.

Every row stores **both** parties rather than a single actor: \`creatorId\` is copied from
the form's own \`creatorId\`, and \`respondeeId\` is the \`requesterId\` that made the call.
This lets the feed render "X submitted Y's form" without a second lookup, and lets a row
be found from either side. On a creator-side event (\`drafted\`, \`published\`) the two ids
are the same user, so consumers reading \`respondeeId\` as "the other party" should branch
on \`activityType\` rather than assume they differ.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the user performing the activity. Stored as \`respondeeId\`. Supplied from the session, not the client. |
| \`formId\` | string (uuid) | Yes | Id of the form the activity belongs to. |
| \`activityType\` | enum | Yes | One of \`drafted\`, \`published\`, \`submitted\`, \`viewed\`. |
| \`metaData\` | object | No | Flat map of string keys to string or number values. Defaults to \`{}\`. |

### Flow

1. The form is fetched by id, excluding soft-deleted rows.
2. Inside one transaction, a \`form_views\` row is inserted for the form.
3. \`visibility\` must be \`authenticated\`; anything else throws — **which rolls the
   transaction back, discarding the view row written in step 2**. Views are therefore only
   ever persisted for \`authenticated\` forms.
4. The activity row is inserted with \`creatorId\` taken from the form, \`respondeeId\` set
   to \`requesterId\`, and \`occuredAt\` defaulted to now.
5. Both users are read back so the broadcast payload can carry their names and avatars.

There is **no ownership or status check**. Any authenticated caller may record any event
type against any \`authenticated\` form, including one they do not own and one that is not
yet published.

### Response

Returns the recorded activity —
\`{ id, formId, creatorId, respondeeId, activityType, metaData, occuredAt, updatedAt }\`
with ISO date strings — plus \`realTime\`, the enriched payload for the socket broadcast:
\`{ creatorId, creatorName, creatorAvatarUrl, respondeeId, respondeeName,
respondeeAvatarUrl, formId, formName, activityType, occuredAt }\`.

Names fall back to the local part of the email when no first or last name is on record,
and to an empty string when the user row is missing.

### Errors

- **Form not found** — no matching, non-deleted form for that id.
- **Activity is only tracked for authenticated forms** — the form's \`visibility\` is not \`authenticated\`.
- **Failed to record activity** — the insert returned no row.

### Notes for callers

This endpoint throws on every guard failure, including the common case of a form that is
not \`authenticated\`. Analytics must never break the action being recorded, so call sites
should wrap it in \`try\`/\`catch\` and log rather than propagate.

Because the session id on the view row is generated fresh per call, repeat visits by the
same person are counted as distinct views.
`,
        },
    };
};

const getActivitiesMeta = ({ getPathFn, tags }: AnalyticsMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Analytics"],
            summary: "List a user's form activities",
            description: `
### Overview

Returns the recent activity feed for the calling user. This is the read side of
\`pushActivity\`, shaped for display rather than analysis: each row is flattened to a
one-line "who did what to which form, and when", with both parties named so the caller
can phrase the sentence from either perspective.

The feed is scoped to **either side** of an activity — a row is returned when
\`requesterId\` matches its \`creatorId\` *or* its \`respondeeId\`. A user therefore sees
both the forms they created and the submissions other people made to those forms, as well
as forms they responded to themselves.

### Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the user whose feed is being read. Supplied from the session, not the client. |

No pagination or filtering parameters are accepted. The feed is a fixed-size dashboard
widget, not a browsable log — see *Shape of the feed*.

### Flow

1. Activities are fetched where \`creatorId\` **or** \`respondeeId\` equals \`requesterId\`,
   excluding rows whose \`deletedAt\` is set — deleting a form retires its activities, so
   they stop appearing in the feed.
2. Results are ordered by \`occuredAt\` descending and capped at **6 rows**.
3. Each row is joined to its \`form\` (for the title) and to both actor relations,
   \`creator\` and \`respondee\`, for their names.
4. An empty result returns \`success: false\` with an explanatory message rather than
   throwing.
5. Each row is flattened: both display names are resolved, the form title is defaulted to
   \`"Untitled Form"\`, and \`occuredAt\` is converted to an ISO string.

### Name resolution

Each name is built from that user's \`firstName\` and \`lastName\`. When neither is on
record it falls back to the local part of their email address, and to an empty string if
the row has no joined user at all. \`creatorName\` and \`respondeeName\` are resolved
independently — neither shadows the other.

### Shape of the feed

Newest first, hard-capped at 6 rows. This serves the dashboard's activity card, which
shows a fixed-height list; there is deliberately no \`limit\`/\`offset\` parameter, so a
caller that needs the full history will need a separate paginated endpoint rather than
tuning this one.

### Response

\`{ success, message, data }\`, where \`data\` is an array of
\`{ formId, creatorId, creatorName, creatorAvatarUrl, respondeeId, respondeeName,
respondeeAvatarUrl, activityType, formName, occuredAt }\` and \`occuredAt\` is an ISO date
string. Avatar urls are empty strings rather than null when the user has none.

An empty feed is **not** an error — it returns \`200\` with \`success: false\`, the message
\`"No activities found"\`, and \`data: []\`. Callers should branch on \`data.length\` and
treat \`success\` as advisory.

### Notes for callers

Rendering a row means choosing a subject: compare the viewer's id against \`creatorId\` to
decide between "You" and the other party's name. Note that on a creator-side activity
(\`drafted\`, \`published\`, \`edited\`) both ids are the same user, so \`respondeeName\`
will repeat \`creatorName\` — phrase those rows
from the creator's side.

Both name fields can be empty strings when the joined user row is missing (an activity
written before the actor columns existed, or a deleted user), so treat them as
\`nullish\` and supply a fallback at the render site.
`,
        },
    };
};

const getAnalyticsMeta = ({ getPathFn, tags }: AnalyticsMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Analytics"],
            summary: "Get aggregated form analytics",
            description: `
### Overview

Returns the full analytics payload behind the analytics dashboard: headline counts, a
period-over-period comparison window, device/country/city distributions, and a
per-question answer breakdown.

Omit \`formId\` for a workspace roll-up across every form the requester can see; pass it
to scope the entire payload to one form. Access follows the usual rule — an admin sees all
non-deleted forms, everyone else only the forms they created.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user. Supplied from the session, not the client. |
| \`formId\` | string (uuid) | No | Restrict every figure to a single form. Omit for the workspace roll-up. |
| \`scope\` | enum | No | One of \`1\`, \`7\`, \`30\` (days) or \`lifetime\`. Defaults to \`7\`. |

### What \`scope\` actually filters

\`scope\` narrows the **set of forms** by \`forms.publishedAt\`, not the set of responses by
\`submittedAt\`. \`scope: "7"\` therefore means *"forms published in the last 7 days, and all
of their responses ever"* — not *"responses received in the last 7 days"*. \`lifetime\`
applies no date filter at all.

\`startDate\`/\`endDate\` and the \`lastScope*\` fields are returned for the caller to render
a comparison label. **No figure in the payload is currently computed over the previous
period** — the previous-window bounds are reported but not yet used.

### Response

\`{ success, message, analytics }\`. On failure \`analytics\` is \`null\` and \`success\` is
\`false\`; the endpoint returns \`200\` in both cases rather than throwing, so branch on
\`success\`.

\`analytics\` contains:

| Field | Type | Description |
| --- | --- | --- |
| \`currentScope\` | enum | Echo of the requested \`scope\`. |
| \`startDate\` / \`endDate\` | date \\| null | Bounds of the selected window; \`startDate\` is \`null\` for \`lifetime\`. |
| \`lastScope\` / \`lastScopeStartDate\` / \`lastScopeEndDate\` | — | The equivalent preceding window, for labelling only. |
| \`totalForms\` | number | Count of forms in scope. |
| \`totalResponses\` | number | **Sum of \`forms.submissionCount\`**, not a count of response rows. |
| \`completedResponses\` | number | Count of response rows with status \`completed\`. |
| \`totalViews\` | number | Count of \`form_views\` rows for the forms in scope. |
| \`completionRate\` | number | \`completedResponses / totalResponses\`, rounded to a whole percent. |
| \`avgTimeCompletion\` | number | Mean \`completion_time\` over completed responses, in whole seconds. |
| \`peakResponsesOnADay\` | object \\| null | \`{ date, count }\` for the single busiest day. With no responses it is \`{ date: null, count: 0 }\`. |
| \`dailyAverage\` | number | Mean responses per day that had at least one response — days with none are not counted as zero, so this reads higher than *total ÷ days in window*. |
| \`deviceStats\` | array | \`{ deviceType, percentage }\`, ordered by count descending. |
| \`countryStats\` | array | \`{ country, percentage }\`, ordered by count descending. |
| \`cityStats\` | array | \`{ city, percentage }\`, ordered by count descending. |
| \`answerBreakdownAnalytics\` | array | One entry per live field — see below. |

Percentages arrive as **strings already carrying a \`%\` suffix** (\`"43.00%"\`), not as
numbers. Rows whose underlying metadata key was absent are grouped under the literal
\`"unknown"\` rather than being dropped.

### Answer breakdown

One entry per non-deleted field of every form in scope:
\`{ questionTitle, questionType, answeredCount, skippedCount, options }\`.

\`options\` is \`null\` for any field without a configured option list (short text, email,
date and so on) — only choice-style fields produce a distribution. When present, every
configured option is listed, including ones nobody picked.

\`skippedCount\` is \`totalResponses - answeredCount\` floored at zero. Because
\`totalResponses\` is the \`submissionCount\` sum rather than a row count, treat it as
indicative rather than exact.

Multi-select answers are stored as one joined string and split on parse, so an option
label that itself contains a comma will be miscounted.

### Errors

Guard failures are returned, not thrown:

- **Invalid payload** — the input failed schema validation; \`analytics\` is \`null\`.
- **Analytics retrieval failed** — the assembled result did not match the output schema;
  the zod message is appended to \`message\`.

An invalid \`scope\` that passes the enum but reaches the date switch throws
\`Invalid scope\` instead of returning.
`,
        },
    };
};

export { pushActivityMeta, getActivitiesMeta, getAnalyticsMeta };
