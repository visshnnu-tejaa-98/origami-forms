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

Appends a single activity row to a form's analytics log. Only forms whose \`visibility\`
is \`authenticated\` are tracked — on any other form the call is rejected rather than
silently ignored.

Two events are currently recorded, and they have **different actors**:

| Event | Actor | Recorded when |
| --- | --- | --- |
| \`created\` | The form's creator | A new form is created. |
| \`submitted\` | The respondent | A respondent submits a response. |

Because the actor differs, the two events cannot share one authorization rule — a
respondent is never the form's creator.

Every row stores **both** parties rather than a single actor: \`creatorId\` is copied from
the form's own \`creatorId\`, and \`respondeeId\` is the \`requesterId\` that made the call.
This lets the feed render "X submitted Y's form" without a second lookup, and lets a row
be found from either side.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the user performing the activity — the creator for \`created\`, the respondent for \`submitted\`. Stored as \`respondeeId\`. |
| \`formId\` | string (uuid) | Yes | Id of the form the activity belongs to. |
| \`activityType\` | enum | Yes | One of \`created\`, \`submitted\`. |
| \`metaData\` | object | No | Flat map of string keys to string or number values. Defaults to \`{}\`. |

### Flow

1. The form is fetched by id, excluding soft-deleted rows.
2. \`visibility\` must be \`authenticated\`; anything else is rejected.
3. For \`created\` — \`requesterId\` must equal the form's \`creatorId\`. Status is **not**
   checked, because a form is still a \`draft\` at the moment it is created.
4. For \`submitted\` — the form's \`status\` must be \`published\`. Ownership is **not**
   checked, because the respondent is not the creator.
5. The activity row is inserted with \`creatorId\` taken from the form, \`respondeeId\` set
   to \`requesterId\`, and \`occuredAt\` defaulted to now.

### Response

Returns the recorded activity:
\`{ id, formId, creatorId, respondeeId, activityType, metaData, occuredAt, updatedAt }\`,
where \`occuredAt\` and \`updatedAt\` are ISO date strings.

### Errors

- **Form not found** — no matching, non-deleted form for that id.
- **Not an authenticated form** — the form's \`visibility\` is not \`authenticated\`.
- **Unauthorized** — a \`created\` event pushed by someone who is not the form's creator.
- **Not accepting responses** — a \`submitted\` event against a form that is not \`published\`.
- **Failed to record activity** — the insert returned no row.

### Notes for callers

This endpoint throws on every guard failure, including the common case of a form that is
not \`authenticated\`. Analytics must never break the action being recorded, so call sites
should wrap it in \`try\`/\`catch\` and log rather than propagate.

On a \`created\` event the requester **is** the creator, so \`creatorId\` and
\`respondeeId\` are written with the same user id. Consumers that read \`respondeeId\` as
"the other party" should branch on \`activityType\` rather than assume the two differ.
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

1. Activities are fetched where \`creatorId\` **or** \`respondeeId\` equals \`requesterId\`.
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
\`{ creatorId, creatorName, respondeeId, respondeeName, activityType, formName, occuredAt }\`
and \`occuredAt\` is an ISO date string.

An empty feed is **not** an error — it returns \`200\` with \`success: false\`, the message
\`"No activities found"\`, and \`data: []\`. Callers should branch on \`data.length\` and
treat \`success\` as advisory.

### Notes for callers

Rendering a row means choosing a subject: compare the viewer's id against \`creatorId\` to
decide between "You" and the other party's name. Note that on a \`created\` activity both
ids are the same user, so \`respondeeName\` will repeat \`creatorName\` — phrase those rows
from the creator's side.

Both name fields can be empty strings when the joined user row is missing (an activity
written before the actor columns existed, or a deleted user), so treat them as
\`nullish\` and supply a fallback at the render site.
`,
        },
    };
};

export { pushActivityMeta, getActivitiesMeta };
